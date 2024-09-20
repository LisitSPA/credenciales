﻿using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;

namespace Application.Attachments.Commands;



public record AddAttachmentsCommand : IRequest<Response<int>>
{
    public int CollaboratorId { get; set; }
    public IFormFile Attachment { get; set; }
    public EAttachmentType AttachmentType { get; set; }
}

public class AddAttachmentsCommandHandler
        (
            IRepository<Collaborator> _repository,
            IRepository<Domain.Entities.Attachment> _repoAttach,
            IMapper _mapper
        )
        : IRequestHandler<AddAttachmentsCommand, Response<int>>
{

    public async Task<Response<int>> Handle(AddAttachmentsCommand command, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
        {
            string fileBase64 = "";
            using (var memoryStream = new MemoryStream())
            {
                command.Attachment.CopyTo(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                fileBase64 = Convert.ToBase64String(fileBytes);
            }

            var attachment = new Domain.Entities.Attachment
            {
                FileBase64 = fileBase64,
                EAttachmentType = command.AttachmentType,
                FileName = command.Attachment.FileName,
                ContentType = command.Attachment.ContentType,
                CollaboratorId = command.CollaboratorId
            };

            _repoAttach.Add(attachment);

            _repository.Save();
            result.Result = attachment.Id;

        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }



}
