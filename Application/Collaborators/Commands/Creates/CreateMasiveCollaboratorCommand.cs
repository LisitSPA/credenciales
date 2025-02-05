﻿using Application.Attachments.Commands;
using Application.Common.Interfaces;
using ClosedXML.Excel;
using Domain.Entities;
using Domain.Enums;
using EAS.Domain.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.APIResponseHandlers.Wrappers;
using Utility.DTOs;
using Utility.PasswordHasher;

namespace Application.Collaborators.Commands.Creates;

public record CreateMasiveCollaboratorCommand : IRequest<Response<MassiveDataDto>>
{
    public IFormFile FileData { get; init; }
}

public class CreateMasiveCollaboratorCommandHandler
    (
        IRepository<Collaborator> _repository,
        IRepository<Leadership> _repoLeadership,
        IRepository<Segment> _repoSegment,
        IRepository<Attachment> _repoAttachment,
        IRepository<User> _userRepository, 
        IPasswordHasherService _passwordHasherService,
        IConfiguration _configuration,
        IMediator _mediator
    )
    : IRequestHandler<CreateMasiveCollaboratorCommand, Response<MassiveDataDto>>
{
    public async Task<Response<MassiveDataDto>> Handle(CreateMasiveCollaboratorCommand command, CancellationToken cancellationToken)
    {

        string[] allowedRoles = new[]
        {
            "1", "2"
        };
        
        Response<MassiveDataDto> result = new();
        try
        {
            if (command.FileData != null)
            {
                var allowedFileTypes = new List<string> { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv" };
                if (!allowedFileTypes.Contains(command.FileData.ContentType))
                {
                    result.ErrorProvider.AddError("Validation", "El tipo de archivo no es válido. Solo se permiten archivos Excel o CSV.");
                    return result;
                }
                var stream = command.FileData.OpenReadStream();
                List<RowWithError> errors = new List<RowWithError>();
                List<RowSuccess> success = new List<RowSuccess>();
                using (XLWorkbook excelWorkbook = new XLWorkbook(stream))
                {
                    IXLRows rows = excelWorkbook.Worksheet(1).RowsUsed();
                    int startIndex = rows.Count();
                    for (int i = 2; i <= rows.Count(); i++)
                    {
                        var cells = excelWorkbook.Worksheet(1).Row(i).Cells("1:25").ToList();

                        var completeName = cells[0].Value.ToString();
                        var rut = cells[1].Value.ToString();
                        var leadershipName = cells[2].Value.ToString();
                        var sede = cells[3].Value.ToString();
                        var position = cells[4].Value.ToString();
                        var phone = cells[5].Value.ToString();
                        var email = cells[6].Value.ToString();
                        var segmentName = cells[7].Value.ToString();
                        var rolValue = cells[8]?.Value.ToString().Trim();

                        rut = AplicarMascaraRut(rut);

                        var segment = _repoSegment.GetAll().Where(x => x.Name == segmentName).FirstOrDefault();
                        if (segment == null)
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"El segmento {segmentName} no existe"]
                            });
                        }
                        
                        if (string.IsNullOrEmpty(rolValue))
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"El rol es requerido"]
                            });
                        } 
                        
                        if (string.IsNullOrEmpty(email))
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"El correo es requerido."]
                            });
                        }
                        else
                        {
                            var existingUser = _userRepository.GetAll().FirstOrDefault(u => u.Email == email);
                            if (existingUser != null)
                            {
                                errors.Add(new RowWithError()
                                {
                                    RowNumber = i,
                                    Messsages = [$"El correo {email} ya existe."]
                                });                                
                            }
                        } 
                        
                        if (!allowedRoles.Contains(rolValue))
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"Valor de Rol no válido: {rolValue}. Debe ser '1' (Jefatura) o '2' (Colaborador)."]
                            });
                        }                        

                        var leadership = _repoLeadership.GetAll().Where(x => x.Name == leadershipName).FirstOrDefault();
                        if (leadership == null)
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"La gerencia {leadershipName} no existe"]
                            });
                        }

                        try
                        {
                            var roleUser = rolValue == "1" ? ERoleUser.Jefatura : ERoleUser.Colaborador;
                            var res = await _mediator.Send(new CreateCollaboratorCommand
                            {
                                SegmentId = segment.Id,
                                CompleteName = completeName,
                                ECollaboratorStatus = ECollaboratorStatus.Fijo,
                                Email = email,
                                LeadershipId = leadership.Id,
                                Phone = phone,
                                Position = position,
                                RUT = rut,
                                Sede = sede,
                                Password = rut,
                                Rol = rolValue,
                                IsFormMassiveUpload = true
                            });

                            if (!res.ErrorProvider.HasError() && res.Result > 0)
                            {
                                success.Add(new RowSuccess
                                {
                                    RowNumber = i,
                                });
                            }
                            else
                            {
                                errors.Add(new RowWithError
                                {
                                    RowNumber = i,
                                    Messsages = res.ErrorProvider.GetErrors().Select(x => x.Message).ToList()
                                });
                            }
                        }
                        catch (ValidationException ex)
                        {
                            errors.Add(new RowWithError
                            {
                                RowNumber = i,
                                Messsages = [ex.Message]
                            });
                        }

                    }
                }
                result.Result = new()
                {
                    Success = success,
                    Errors = errors,
                };
                return result;
            }
            return result;


        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }

    private string AplicarMascaraRut(string rut)
    {
        if (string.IsNullOrEmpty(rut))
            return rut;

        rut = rut.Replace(".", "").Replace("-", "").ToUpper();

        if (rut.Length < 2)
            return rut;

        string cuerpo = rut.Substring(0, rut.Length - 1);
        string dv = rut.Substring(rut.Length - 1);

        string cuerpoFormateado = string.Empty;
        int contador = 0;
        for (int i = cuerpo.Length - 1; i >= 0; i--)
        {
            cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
            contador++;
            if (contador == 3 && i != 0)
            {
                cuerpoFormateado = "." + cuerpoFormateado;
                contador = 0;
            }
        }

        return $"{cuerpoFormateado}-{dv}";
    }




    private bool SetPhoto(string photoName, int collaboratorId)
    {
        var attachment = new Attachment
        {
            EAttachmentType = EAttachmentType.Photo,
            FileName = photoName,
            CollaboratorId = collaboratorId
        };

    _repoAttachment.Add(attachment);

        return _repository.Save();
    }

}

