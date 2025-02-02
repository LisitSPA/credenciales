﻿using Application.Attachments.Commands;
using Application.Collaborators.Queries;
using Application.Common.Interfaces;
using Application.Notifications;
using DevExtreme.AspNet.Data.ResponseModel;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;

namespace Application.Collaborators.Commands.Updates;

public record UpdateCollaboratorCommand : IRequest<Response<int>>
{
    public int Id { get; set; }
    public string CompleteName { get; set; }
    public string RUT { get; set; }
    public int LeadershipId { get; set; }
    public int SegmentId { get; set; }
    public string Position { get; set; }
    public string Sede { get; set; }
    public string Role { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public ECollaboratorStatus ECollaboratorStatus { get; set; }
    //public IFormFile Photo { get; set; }
}

public class CreateCollaboratorCommandHandler
    (
        IRepository<Collaborator> _repository,
        IRepository<User> _repositoryUser,
        IRepository<Attachment> _repositoryAttach,
        IMediator _mediator,
        IEmailNotificationService _emailNotification
    )
    : IRequestHandler<UpdateCollaboratorCommand, Response<int>>
{
    public async Task<Response<int>> Handle(UpdateCollaboratorCommand request, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
        {
            var collaborator = _repository.GetAll().First(x => x.Id == request.Id);

            collaborator.CompleteName = request.CompleteName;
            collaborator.RUT = request.RUT;
            collaborator.Area = request.Sede;
            collaborator.LeadershipId = request.LeadershipId;
            collaborator.Position = request.Position;
            collaborator.Phone = request.Phone;
            collaborator.ECollaboratorStatus = request.ECollaboratorStatus;
            collaborator.Email = request.Email;
            collaborator.SegmentId = request.SegmentId;

            _repository.Update(collaborator);
            _repository.Save();

            IQueryable<User> users = _repositoryUser.GetAll();

            User user = users.FirstOrDefault(user => user.CollaboratorId == collaborator.Id);
            if (user != null)
            {
                user.ERoleUser = Enum.Parse<ERoleUser>(request.Role);
                _repositoryUser.Update(user);
                _repositoryUser.Save();
            }


            //if (request.Photo != null)
            //{
            //    //delete current
            //    var currentPhoto = _repositoryAttach.GetAll().FirstOrDefault(x => x.CollaboratorId == request.Id && x.EAttachmentType == EAttachmentType.Photo);
            //    if (currentPhoto != null)
            //    {
            //        currentPhoto.Active = false;
            //        _repositoryAttach.Update(currentPhoto);
            //        _repositoryAttach.Save();
            //    }

            //    //add new
            //    _mediator.Send(new AddAttachmentsCommand { CollaboratorId = collaborator.Id, AttachmentType = EAttachmentType.Photo, Attachment = request.Photo });

            //}

            result.Result = collaborator.Id;

        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }
}

