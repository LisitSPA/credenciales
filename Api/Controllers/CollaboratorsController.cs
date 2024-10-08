using Application.Collaborators.Commands;
using Application.Collaborators.Queries;
using Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/collaborators")]
    public class CollaboratorsController : ControllerBase
    {

        [HttpGet("paginated", Name = "GetAllCollaboratorsPaginated")]
        public async Task<IActionResult> GetAllCollaboratorsPaginated([FromQuery] DataSourceLoadOptions query)
        {
            var result = await Mediator.Send(new GetCollaboratorsPaginatedQueryDE { Params = query });
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("", Name = "CreateCollaborator")]
        public async Task<IActionResult> CreateCollaborator([FromQuery] CreateCollaboratorCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UpdateMassive", Name = "UpdateMassiveCollaborator")]
        public async Task<IActionResult> UpdateMassiveCollaborator([FromQuery] CreateMasiveCollaboratorCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

    }
}