using System.Linq.Expressions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Users.Commands;
using Application.Users.Queries.DTOs;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.Linq;
using Microsoft.AspNetCore.Http;
using DevExpress.XtraPrinting.Native;
using Microsoft.Extensions.Configuration;

namespace Application.Login.Commands
{
    public record ValidateEmailUserCommand : IRequest<Responsed<ValidateEmailDto>>
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }

    public class ValidateEmailUserCommandHandler : IRequestHandler<ValidateEmailUserCommand, Responsed<ValidateEmailDto>>
    {
        private readonly IRepository<User> _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ValidateEmailUserCommandHandler(
            IRepository<User> userRepository,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public async Task<Responsed<ValidateEmailDto>> Handle(ValidateEmailUserCommand request, CancellationToken cancellationToken)
        {
            string apiKey = _configuration.GetSection("ApiKey").Value!;

            if (apiKey != request.Token)
                return new Responsed<ValidateEmailDto>(null, false, "El Token es inválido.");

            if (!IsValidEmail(request.Email))
                return new Responsed<ValidateEmailDto>(null, false, "El formato del correo electrónico no es válido.");

            User user = (await _userRepository.GetByConditionsAsync(u => u.Email == request.Email)).FirstOrDefault();

            if (user == null)
                return new Responsed<ValidateEmailDto>(null, false, "El correo electrónico no está asociado a ningún usuario.");

            ValidateEmailDto userDto = _mapper.Map<ValidateEmailDto>(user);

            return new Responsed<ValidateEmailDto>(userDto, true, "El correo electrónico es válido.");
        }
        
        private bool IsValidEmail(string email)
        {
            var emailRegex = new System.Text.RegularExpressions.Regex(@"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
            return emailRegex.IsMatch(email);
        }
    }
}
