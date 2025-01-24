using Application.Attachments.Commands;
using Application.Collaborators.Queries;
using Application.Common.Interfaces;
using Application.Notifications;
using DevExpress.XtraReports.Wizards.Templates;
using DevExtreme.AspNet.Data.ResponseModel;
using DocumentFormat.OpenXml.Vml.Office;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Notifications.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;
using Utility.PasswordHasher;

namespace Application.Collaborators.Commands.Creates;

public record TerminosyCondicionesCommand : IRequest<Response<int>>
{
    public required int id { get; set; }
    public required bool AceptaTerminos { get; set; }
    public required string IP { get; set; }
}

public class TerminosyCondicionesCommandHandler
    (
        IRepository<Collaborator> _repository,
        IRepository<User> _userRepository,
        IMediator _mediator,
        IConfiguration _configuration,
        IEmailNotificationService _emailNotification,
        IPasswordHasherService _passwordHasherService
    )
    : IRequestHandler<TerminosyCondicionesCommand, Response<int>>
{
    public async Task<Response<int>> Handle(TerminosyCondicionesCommand request, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
        {

            var user = _repository.GetAll().Where(x => x.Id == request.id).FirstOrDefault();

            if (user != null)
            {

                Collaborator existe = user;
                existe.AceptaTerminosyCondiciones = request.AceptaTerminos;
                existe.FechaTerminoyCondiciones = DateTime.Now;
                existe.IPTerminoyCondiciones = request.IP;

                _repository.Update(existe);
                _repository.Save();

                if (!request.AceptaTerminos)
                {
                    var correo = _configuration["TerminoyCondiciones:correoRechazo"];

                    _emailNotification.SendEmail(new EmailNotification()
                    {
                        ToEmail = correo,
                        Body = new Dictionary<string, string> {
                            { "NAME", user.CompleteName },
                            { "TEXT", GenerarHtmlCorreoTerminoCondiciones(user.CompleteName, request.IP) } 
                        },
                        Subject = "DDC - TERMINOS Y CONDICIONES RECHAZADO",
                    });

                }

                result.Result = 1;
            }
        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }

    public string GenerarHtmlCorreoTerminoCondiciones(string Productor, string IP)
    {
        string mail = @"
                <html>
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <style>
                        .mail-contener {
                            width: 100%;
                            padding: 10px;
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 13px;
                        }
                        .mail-head {}
                        .mail-head td {
                            padding: 10px auto;
                        }
                        .mail-head p {
                            display: block;
                            width: 100%;
                            padding: 10px 0;
                        }
                        .mail-body {
                            margin-bottom: 5px;
                            padding-right: 10px;
                        }
                        .mail-body>.btn-accion {
                            width: 110px;
                            padding-right: 5px;
                        }
                        .mail-body>.btn-accion a {
                            display: inline-block;
                            background: linear-gradient(90deg, #8FD35D, #74BB58);
                            padding: 4px;
                            color: white;
                            width: 110px;
                            height: 35px;
                            border-style: none;
                            cursor: pointer;
                            border-radius: 5%;
                            text-decoration: none;
                            justify-content: center;
                            align-items: center;
                            background-color: aqua;
                            vertical-align: middle;
                            align-items: center;
                            border: none;
                        }
                        .mail-body>.btn-accion a p {
                            text-align: center;
                            margin: 6% 0 !important;
                            font-size: 15px;
                        }
                        .mail-footer {
                            text-align: left;
                            margin: 9% 0 !important;
                        }
                        .mail-footer td {
                            padding: 10px;
                            padding-left: 0;
                        }
                        .mail-footer td span {
                            color: #BCBDBF;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <table class=""mail-contener"" border=""0"" cellpadding=""0"" cellspacing=""0"">
                        <tr class=""mail-head"">
                            <td colspan=""2"">
                                <p>Estimados,<br/>
                                A través del presente correo, le notificamos que hemos registrado su decisión de no aceptar los Términos y Condiciones del Portal de Productores.</p>
                                
                                <br/>
                                USUARIO: {user}
                                <br/>
                                IP : {IP}
                            </td>
                        </tr>
                        <tr class=""mail-footer"">
                            <td colspan=""2"">
                                <span>Esto es solo un correo informativo,
                                    por favor no responder</span>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>";

        mail = mail.Replace("{user}", Productor);
        mail = mail.Replace("{IP}", IP);

        return mail;
    }
}

