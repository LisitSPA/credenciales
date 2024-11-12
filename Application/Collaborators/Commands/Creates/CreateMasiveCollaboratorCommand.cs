using Application.Attachments.Commands;
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
        IConfiguration _configuration,
        IMediator _mediator
    )
    : IRequestHandler<CreateMasiveCollaboratorCommand, Response<MassiveDataDto>>
{
    public async Task<Response<MassiveDataDto>> Handle(CreateMasiveCollaboratorCommand command, CancellationToken cancellationToken)
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
                        var cells = excelWorkbook.Worksheet(1).Row(i).Cells("1:25").ToList();

                        var completeName = cells[0].Value.ToString();
                        var rut = cells[1].Value.ToString();
                        var leadershipName = cells[2].Value.ToString();
                        var sede = cells[3].Value.ToString();
                        var position = cells[4].Value.ToString();
                        var phone = cells[5].Value.ToString();
                        var email = cells[6].Value.ToString();
                        var segmentName = cells[7].Value.ToString();
                        var photoName = cells[8].Value.ToString();
                        var status = (int)cells[9].Value;
                        var password = cells[10]?.Value; //opcional

                        var segment = _repoSegment.GetAll().Where(x => x.Name == segmentName).FirstOrDefault();
                        if (segment == null)
                        {
                            errors.Add(new RowWithError()
                            {
                                RowNumber = i,
                                Messsages = [$"El segmento {segmentName} no existe"]
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

                        if (errors.Count > 0)
                        {
                            result.Result = new()
                            {
                                Success = success,
                                Errors = errors,
                            };
                            return result;
                        }

                        try
                        {
                            var res = await _mediator.Send(new CreateCollaboratorCommand
                            {
                                SegmentId = segment.Id,
                                CompleteName = completeName,
                                ECollaboratorStatus = (ECollaboratorStatus)status,
                                Email = email,
                                LeadershipId = leadership.Id,
                                Phone = phone,
                                Position = position,
                                RUT = rut,
                                Sede = sede,
                                Password = password?.ToString()
                            });

                            if (!res.ErrorProvider.HasError() && res.Result > 0)
                            {
                                success.Add(new RowSuccess
                                {
                                    RowNumber = i,
                                });

                                if (!string.IsNullOrEmpty(photoName))
                                {
                                    SetPhoto(photoName, res.Result);
                                }
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

