using Application.Leaderships.Commands;
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

        //[HttpGet("paginated", Name = "GetAllCollaboratorsPaginated")]
        //public async Task<IActionResult> GetAllCollaboratorsPaginated([FromQuery] DataSourceLoadOptions query)
        //{
        //    var result = await Mediator.Send(new GetCollaboratorsPaginatedQueryDE { Params = query });
        //    return HandleResult(result.Result, result.ErrorProvider);
        //}

        [HttpPost("", Name = "CreateLeadership")]
        public async Task<IActionResult> CreateLeadership([FromQuery] CreateLeadershipCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UpdateMassive", Name = "UpdateMassiveLeadership")]
        public async Task<IActionResult> UpdateMassiveLeadership([FromQuery] CreateMasiveLeadershipCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

    }
}