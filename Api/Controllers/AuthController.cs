using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Api.JwtConfig;
using Application.Users.Commands;
using Microsoft.AspNetCore.Authorization;
using Application.Login.Commands;
using DevExpress.CodeParser;
using Newtonsoft.Json;
using MediatR;
using Domain.Domain.Helpers;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IMediator _mediator;

        public AuthController(IConfiguration config, IMediator mediator)
        {
            _config = config;
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(ValidateLoginCommand authenticate)
        {
            var result = await Mediator.Send(authenticate);
            var user = result.Result;

            if (user != null)
            {
                var token = JwtConfiguration.GenerateToken(user, _config);
                return Ok(new { token });
            }

            return HandleResult(result.Result, result.ErrorProvider);
        }

        [AllowAnonymous]
        [HttpPost("passwordRecovery")]
        public async Task<IActionResult> RecoverPassword(PasswordRecoveryCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }

        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordCommand command)
        {
            var result = await Mediator.Send(command);
            return HandleResult(result.Result, result.ErrorProvider);
        }
    }
}