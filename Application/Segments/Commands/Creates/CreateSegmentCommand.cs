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

namespace Application.Segments.Commands.Creates;

public record CreateSegmentCommand : IRequest<Response<int>>
{
    public string Name { get; set; }
    public string Color { get; set; }
}

public class CreateCollaboratorCommandHandler
    (
        IRepository<Segment> _repository,
        IMediator _mediator
    )
    : IRequestHandler<CreateSegmentCommand, Response<int>>
{
    public async Task<Response<int>> Handle(CreateSegmentCommand request, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
        {
            var exists = _repository.GetAllActive().Any(x => x.Name == request.Name);
            if (exists)
            {
                result.ErrorProvider.AddError("Validation", $"El segmento '{request.Name}' ya existe");
                return result;
            }

            var segment = new Segment()
            {
                Name = request.Name,
                Color = request.Color,
            };

            _repository.Add(segment);
            _repository.Save();

            result.Result = segment.Id;
        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }
}


