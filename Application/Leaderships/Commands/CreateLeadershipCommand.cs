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

namespace Application.Leaderships.Commands;

public record CreateLeadershipCommand : IRequest<Response<int>>
{
    public string Name { get; set; }
}

public class CreateAreaCommandHandler
    (
        IRepository<Leadership> _repository,
        IMediator _mediator
    )
    : IRequestHandler<CreateLeadershipCommand, Response<int>>
{
    public async Task<Response<int>> Handle(CreateLeadershipCommand request, CancellationToken cancellationToken)
    {
        Response<int> result = new();
        try
		{
            var exists = _repository.GetAll().Any(x => x.Name == request.Name);
            if(exists)
            {
                throw new Exception($"Gerencia {request.Name} ya existe");
            }

            var leadership = new Leadership()
            {
                Name = request.Name,
            };

            _repository.Add(leadership);
            _repository.Save();


            result.Result = leadership.Id;

        }
        catch (Exception ex)
		{
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
		return result;
    }

}

