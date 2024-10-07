using Application.Collaborators.Commands;
using Application.Collaborators.Queries;
using Application.Segments.Commands;
using Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/segment")]
    public class SegmentController : ControllerBase
    {

        //[HttpGet("paginated", Name = "GetAllCollaboratorsPaginated")]
        //public async Task<IActionResult> GetAllCollaboratorsPaginated([FromQuery] DataSourceLoadOptions query)
        //{
        //    var result = await Mediator.Send(new GetCollaboratorsPaginatedQueryDE { Params = query });
        //    return HandleResult(result.Result, result.ErrorProvider);
        //}

        [HttpPost("", Name = "CreateSegment")]
        public async Task<IActionResult> CreateSegment([FromQuery] CreateSegmentCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UpdateMassive", Name = "UpdateMassiveSegment")]
        public async Task<IActionResult> UpdateMassiveSegment([FromQuery] CreateMasiveSegmentCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

    }
}