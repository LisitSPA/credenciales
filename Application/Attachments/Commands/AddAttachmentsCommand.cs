using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing.Template;
using Microsoft.Extensions.Configuration;
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
            IConfiguration _configuration
        )
        : IRequestHandler<AddAttachmentsCommand, Response<int>>
{

    public async Task<Response<int>> Handle(AddAttachmentsCommand command, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
        {
            var memoryStream = new MemoryStream();
            command.Attachment.CopyTo(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();
            string base64String = Convert.ToBase64String(fileBytes);

            var existingAttachment = _repoAttach.GetAll()
                .Where(a => a.CollaboratorId == command.CollaboratorId)
                .FirstOrDefault();


            if (existingAttachment != null)
            {
                existingAttachment.FileName = command.Attachment.FileName;
                existingAttachment.FileType = command.Attachment.ContentType;
                existingAttachment.Base64 = base64String;

                _repoAttach.Update(existingAttachment);
                result.Result = existingAttachment.Id;
            }
            else
            {

                var attachment = new Domain.Entities.Attachment
                {
                    EAttachmentType = command.AttachmentType,
                    FileName = command.Attachment.FileName,
                    CollaboratorId = command.CollaboratorId,
                    FileType = command.Attachment.ContentType,
                    Base64 = base64String
                };

                _repoAttach.Add(attachment);
                result.Result = attachment.Id; 
            }

  
            _repository.Save();
        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }
}


