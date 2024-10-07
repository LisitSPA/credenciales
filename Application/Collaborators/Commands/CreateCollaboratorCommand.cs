using Application.Attachments.Commands;
using Application.Collaborators.Queries;
using Application.Common.Interfaces;
using Application.Notifications;
using DevExtreme.AspNet.Data.ResponseModel;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Notifications.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;

namespace Application.Collaborators.Commands;

public record CreateCollaboratorCommand : IRequest<Response<int>>
{
    public string CompleteName { get; set; }
    public string RUT { get; set; }
    public int LeadershipId { get; set; }
    public int SegmentId { get; set; }
    public string Position { get; set; }
    public string Sede { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public ECollaboratorStatus ECollaboratorStatus { get; set; }
    public IFormFile Photo { get; set; }
}

public class CreateCollaboratorCommandHandler
    (
        IRepository<Collaborator> _repository,
        IMediator _mediator
    )
    : IRequestHandler<CreateCollaboratorCommand, Response<int>>
{
    public async Task<Response<int>> Handle(CreateCollaboratorCommand request, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
		{
            var collaborator = new Collaborator()
            {
                CompleteName = request.CompleteName,
                RUT = request.RUT,
                Area = request.Sede,
                LeadershipId = request.LeadershipId,
                Position = request.Position,
                Phone = request.Phone,
                ECollaboratorStatus = request.ECollaboratorStatus,
                Email = request.Email,
                SegmentId = request.SegmentId,
                Active = true
            };

            //_repository.Add(collaborator);
            //_repository.Save();

            //if(request.Photo != null)
            //    _mediator.Send(new AddAttachmentsCommand { CollaboratorId = collaborator.Id, AttachmentType = EAttachmentType.Photo, Attachment = request.Photo });

            if (request.Photo != null)
                _mediator.Send(new AddAttachmentsCommand { CollaboratorId = collaborator.Id, AttachmentType = EAttachmentType.Photo, Attachment = request.Photo });

            SendEmail(collaborator);

            result.Result = collaborator.Id;

        }
        catch (Exception ex)
		{
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
		return result;
    }

    private static void SendEmail(Collaborator collaborator)
    {
        Dictionary<string, string> data = new Dictionary<string, string>()
        {
            { "NAME", collaborator.CompleteName },
        };

        EmailNotificationService.SendEmail(new EmailNotification
        {
            Body = Templates.FillTemplate("Assets/EmailTemplates", "CollaboratorCreation.html", data).Result,
            Subject = "Configura tu firma de correo",
            ToEmail = collaborator.Email
        });
    }
}

