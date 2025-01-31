using Application.Common.Interfaces;
using Application.Users.Queries.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;
using Utility.PasswordHasher;

namespace Application.Users.Commands;

public record ValidateLoginCommand : IRequest<Response<UserLoginDto>>
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class ValidateLoginCommandHandler : IRequestHandler<ValidateLoginCommand, Response<UserLoginDto>>
{
    private readonly IRepository<User> _repository;
    private readonly IRepository<Collaborator> _repositoryCollaborator;
    private readonly IMapper _mapper;
    private readonly IPasswordHasherService _passwordHasher;

    public ValidateLoginCommandHandler(
        IRepository<User> repository,
        IRepository<Collaborator> repositoryCollaborators,
        IPasswordHasherService passwordHasherService,
        IMapper mapper
        )
    {
        _repository = repository;
        _mapper = mapper;
        _passwordHasher = passwordHasherService;
        _repositoryCollaborator = repositoryCollaborators;
    }

    public async Task<Response<UserLoginDto>> Handle(ValidateLoginCommand command, CancellationToken cancellationToken)
    {
        Response<UserLoginDto> result = new();
        try
        {
            var pass = _passwordHasher.HashPassword(command.Password);

            var user = _repository.GetAllActive()
                 .Where(x => x.Email == command.Username)
                 .ProjectTo<UserLoginDto>(_mapper.ConfigurationProvider)
                 .FirstOrDefault();

            if (user is not null && _passwordHasher.VerifyPassword(command.Password, user?.Password))
            {
                Collaborator collaborator = await _repositoryCollaborator.GetByIdAsync(user.CollaboratorId);
                user.AceptaTerminosyCondiciones = collaborator.AceptaTerminosyCondiciones ?? false;
                result.Result = user;
            }
            else
                result.ErrorProvider.AddError("400","Incorrect user or password");

        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }

    
   



}



