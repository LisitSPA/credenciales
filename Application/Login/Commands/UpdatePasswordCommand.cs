using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Domain.Helpers;
using Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Utility.PasswordHasher;

namespace Application.Login.Commands
{
    public record UpdatePasswordCommand : IRequest<Responsed<ValidateEmailResponseDto>>
    {
        public string Data { get; set; }
    }

    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, Responsed<ValidateEmailResponseDto>>
    {
        private readonly IRepository<User> _userRepository;
        private readonly IPasswordHasherService _passwordHasherService;
        private readonly IConfiguration _configuration;

        public UpdatePasswordCommandHandler(
            IRepository<User> userRepository,
            IPasswordHasherService passwordHasherService,
            IConfiguration configuration
        )
        {
            _userRepository = userRepository;
            _passwordHasherService = passwordHasherService;
            _configuration = configuration;
           
        }

        public async Task<Responsed<ValidateEmailResponseDto>> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            string encryptKey = _configuration.GetSection("EncryptKey").Value!;

            ValidateEmailDto validateEmailDto = JsonConvert.DeserializeObject<ValidateEmailDto>(request.Data.Decrypt(encryptKey));

            User user = (await _userRepository.GetByConditionsAsync(u => u.Id == validateEmailDto.Id && u.Email == validateEmailDto.Email)).FirstOrDefault();

            if (user == null)
                return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto() { Data = null, Message = "El correo electrónico o el ID no están asociados a ningún usuario.", Status = false });

            string apiKey = _configuration.GetSection("ApiKey").Value!;

            if (apiKey != validateEmailDto.Token)
                return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto() { Data = null, Message = "El Token es inválido.", Status = false });

            user.Password = _passwordHasherService.HashPassword(validateEmailDto.Password);

            _userRepository.Update(user);
            _userRepository.Save();

            var userDto = new ValidateEmailDto
            {
                Id = user.Id,
                Email = user.Email
            };

            return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto() { Data = userDto, Message = "La contraseña ha sido actualizada correctamente.", Status = true });
        }
    }
}
