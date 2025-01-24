using Application.Collaborators.Commands.Delete;
using Application.Collaborators.Commands.Updates;
using Application.Leaderships.Commands.Creates;
using Application.Leaderships.Commands.Delete;
using Application.Leaderships.Commands.Updates;
using Application.Leaderships.Queries;
using Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/leadership")]
    public class LeadershipController : ControllerBase
    {

        [HttpGet("paginated", Name = "GetAllLeadershipsPaginated")]
        public async Task<IActionResult> GetAllLeadershipsPaginated([FromQuery] DataSourceLoadOptions query)
        {
            var result = await Mediator.Send(new GetLeadershipsPaginatedQueryDE { Params = query });
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpGet("{id}", Name = "GetLeadershipById")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> GetLeadershipById(int id)
        {
            var result = await Mediator.Send(new GetLeadershipByIdQuery { Id = id });
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("", Name = "CreateLeadership")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> CreateLeadership([FromBody] CreateLeadershipCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UploadMassive", Name = "UploadMassiveLeadership")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> UploadMassiveLeadership([FromQuery] CreateMasiveLeadershipCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPut("", Name = "UpdateLeadership")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> UpdateLeadership(UpdateLeadershipCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpDelete("{id}", Name = "DeleteLeadership")]
        [Authorize(Roles = "1,2")] // Colaborador = 1, Jefatura = 2
        public async Task<IActionResult> DeleteLeadership(int id)
        {
            var result = await Mediator.Send(new DeleteLeadershipCommand { Id = id });
            return HandleResult(result.Result, result.ErrorProvider);
        }

    }
}