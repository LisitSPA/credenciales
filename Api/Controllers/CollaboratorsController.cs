using Application.Attachments.Commands;
using Application.Collaborators.Commands.Creates;
using Application.Collaborators.Commands.Delete;
using Application.Collaborators.Commands.Updates;
using Application.Collaborators.Queries;
using Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
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

        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetCollaboratorsById")]
        public async Task<IActionResult> GetCollaboratorsById(int id)
        {
            var result = await Mediator.Send(new GetCollaboratorByIdQuery { Id = id });
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("", Name = "CreateCollaborator")]
        public async Task<IActionResult> CreateCollaborator([FromBody] CreateCollaboratorCommand command)
        {           
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("UploadMassive", Name = "UploadMassiveCollaborator")]
        public async Task<IActionResult> UploadMassiveCollaborator([FromQuery] CreateMasiveCollaboratorCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPost("Attachments", Name = "SaveAttachment")]
        public async Task<IActionResult> SaveAttachment([FromQuery] AddAttachmentsCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPut("{id}", Name = "UpdateCollaborator")]
        public async Task<IActionResult> UpdateCollaborator(int id, [FromBody] UpdateCollaboratorCommand command)
        {
            command.Id = id; 
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }


        [HttpDelete("{id}", Name = "DeleteCollaborator")]
        public async Task<IActionResult> DeleteCollaborator(int id)
        {
            var result = await Mediator.Send(new DeleteCollaboratorCommand { Id = id});
            return HandleResult(result.Result, result.ErrorProvider);
        }

    }
}