using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using Utility.PasswordHasher;

namespace Application.Login.Commands
{
    public record UpdatePasswordCommand : IRequest<Responsed<UpdatePasswordDto>>
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
    }

    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, Responsed<UpdatePasswordDto>>
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

        public async Task<Responsed<UpdatePasswordDto>> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            User user = (await _userRepository.GetByConditionsAsync(u => u.Id == request.Id && u.Email == request.Email)).FirstOrDefault();

            if (user == null)
                return new Responsed<UpdatePasswordDto>(null, false, "El correo electrónico o el ID no están asociados a ningún usuario.");

            string apiKey = _configuration.GetSection("ApiKey").Value!;

            if (apiKey != request.Token)
                return new Responsed<UpdatePasswordDto>(null, false, "El Token es inválido.");

            user.Password = _passwordHasherService.HashPassword(request.NewPassword);

            _userRepository.Update(user);
            _userRepository.Save();

            var userDto = new UpdatePasswordDto
            {
                Id = user.Id,
                Email = user.Email
            };

            return new Responsed<UpdatePasswordDto>(userDto, true, "La contraseña ha sido actualizada correctamente.");
        }
    }
}
