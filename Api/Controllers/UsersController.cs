using Application.Collaborators.Queries;
using Application.Login.Commands;
using Application.Users.Commands;
using Domain.Common;
using Domain.Domain.Helpers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Threading.Tasks;
namespace Api.Controllers
{
    [ApiController]
    [Route("Usuarios")]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IMediator _mediator;

        public UsersController(IConfiguration config, IMediator mediator)
        {
            _config = config;
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("ValidaCorreoUsuario")]
        public async Task<IActionResult> validateEmailUser(ValidateEmailUserCommand command)
        {
            var result = await _mediator.Send(command);
            var encryptedResult = JsonConvert.SerializeObject(result).Encrypt(_config.GetSection("EncryptKey").Value!);
            return Ok(encryptedResult);

        }

        [AllowAnonymous]
        [HttpPost("ActualizarContrasena")]
        public async Task<IActionResult> updatePassword(UpdatePasswordCommand command)
        {
            var result = await _mediator.Send(command);
            var encryptedResult = JsonConvert.SerializeObject(result).Encrypt(_config.GetSection("EncryptKey").Value!);
            return Ok(encryptedResult);
             
        }
    }
}