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
using System.Threading;
using System.Threading.Tasks;
using Utility.APIResponseHandlers.Wrappers;
using Utility.DTOs;

namespace Application.Leaderships.Commands.Creates;

public record CreateMasiveLeadershipCommand : IRequest<Response<MassiveDataDto>>
{
    public IFormFile FileData { get; init; }
}

public class CreateMasiveLeadershipCommandHandler
    (
        IRepository<Collaborator> _repository,
        IRepository<Leadership> _repoLeadership,
        IRepository<Segment> _repoSegment,
        IRepository<Attachment> _repoAttachment,
        IConfiguration _configuration,
        IMediator _mediator
    )
    : IRequestHandler<CreateMasiveLeadershipCommand, Response<MassiveDataDto>>
{
    public async Task<Response<MassiveDataDto>> Handle(CreateMasiveLeadershipCommand command, CancellationToken cancellationToken)
    {
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
                        var cells = excelWorkbook.Worksheet(1).Row(i).Cells("1:10").ToList();

                        var name = cells[0].Value.ToString();

                        try
                        {
                            var res = await _mediator.Send(new CreateLeadershipCommand
                            {
                                Name = name
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
                        catch (Exception ex)
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
            }
            return result;


        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
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

