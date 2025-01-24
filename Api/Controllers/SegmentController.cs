using Application.Collaborators.Commands;
using Application.Collaborators.Queries;
using Application.Leaderships.Commands.Delete;
using Application.Leaderships.Commands.Updates;
using Application.Leaderships.Queries;
using Application.Segments.Commands.Creates;
using Application.Segments.Commands.Delete;
using Application.Segments.Commands.Updates;
using Application.Segments.Queries;
using Domain.Common;
using DataAccess.DBContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/segment")]
    public class SegmentController : ControllerBase
    {

        [HttpGet("paginated", Name = "GetAllSegmentPaginated")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> GetAllSegmentPaginated([FromQuery] DataSourceLoadOptions query)
        {
            var result = await Mediator.Send(new GetSegmentPaginatedQueryDE { Params = query });
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpGet("{id}", Name = "GetSegmentById")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> GetLeadershipById(int id)
        {
            var result = await Mediator.Send(new GetSegmentByIdQuery { Id = id });
            return HandleResult(result.Result, result.ErrorProvider);
        }



        [HttpPost("", Name = "CreateSegment")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> CreateSegment([FromBody] CreateSegmentCommand command)
        {
            var result = await Mediator.Send(command);

            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UploadMassive", Name = "UploadMassiveSegment")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> UploadMassiveSegment([FromQuery] CreateMasiveSegmentCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPut("", Name = "UpdateSegment")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> UpdateSegment(UpdateSegmentCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpDelete("{id}", Name = "DeleteSegment")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> DeleteSegment(int id)
        {
            var result = await Mediator.Send(new DeleteSegmentCommand { Id = id });
            return HandleResult(result.Result, result.ErrorProvider);
        }
    }
}