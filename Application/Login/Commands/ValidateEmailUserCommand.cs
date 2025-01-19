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
using Newtonsoft.Json;
using Domain.Domain.Helpers;

namespace Application.Login.Commands
{
    public record ValidateEmailUserCommand : IRequest<Responsed<ValidateEmailResponseDto>>
    {
        public string Data { get; set; }
    }

    public class ValidateEmailUserCommandHandler : IRequestHandler<ValidateEmailUserCommand, Responsed<ValidateEmailResponseDto>>
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

        public async Task<Responsed<ValidateEmailResponseDto>> Handle(ValidateEmailUserCommand request, CancellationToken cancellationToken)
        {
            string apiKey = _configuration.GetSection("ApiKey").Value!;
            string encryptKey = _configuration.GetSection("EncryptKey").Value!;

            ValidateEmailDto validateEmailDto = JsonConvert.DeserializeObject<ValidateEmailDto>(request.Data.Decrypt(encryptKey));

            if (apiKey != validateEmailDto.Token)
                return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto()
                {
                    Data = null,
                    Message = "El Token es inválido.",
                    Status = false
                });

            if (!IsValidEmail(validateEmailDto.Email))
                return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto()
                {
                    Data = null,
                    Message = "El formato del correo electrónico no es válido.",
                    Status = false
                });

            User user = (await _userRepository.GetByConditionsAsync(u => u.Email == validateEmailDto.Email)).FirstOrDefault();

            if (user == null)
                return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto() { Data = null, Message = "El correo electrónico no está asociado a ningún usuario.", Status = false });

            ValidateEmailDto userDto = _mapper.Map<ValidateEmailDto>(user);

            return new Responsed<ValidateEmailResponseDto>(new ValidateEmailResponseDto() { Data = userDto, Message = "El correo electrónico es válido.", Status = true });
        }
        
        private bool IsValidEmail(string email)
        {
            var emailRegex = new System.Text.RegularExpressions.Regex(@"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
            return emailRegex.IsMatch(email);
        }
    }
}
