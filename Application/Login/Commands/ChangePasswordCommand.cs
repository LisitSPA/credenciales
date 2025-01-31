using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Utility.DTOs;
using Utility.PasswordHasher;

namespace Application.Users.Commands;

public record ChangePasswordCommand : IRequest<Response<bool>>
{
    public int Id { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Response<bool>>
{
    private readonly IRepository<User> _repository;
    private readonly IMapper _mapper;
    private readonly IPasswordHasherService _passwordHasher;

    public ChangePasswordCommandHandler(
        IRepository<User> repository,
        IPasswordHasherService passwordHasherService,
        IMapper mapper
        )
    {
        _repository = repository;
        _mapper = mapper;
        _passwordHasher = passwordHasherService;
    }

    public async Task<Response<bool>> Handle(ChangePasswordCommand command, CancellationToken cancellationToken)
    {
        Response<bool> result = new();
        try
        {
            var user = _repository.GetAllActive()
                 .FirstOrDefault(x => x.Id == command.Id);

            if (user is not null && _passwordHasher.VerifyPassword(command.OldPassword, user?.Password))
            {
                user.Password = _passwordHasher.HashPassword(command.NewPassword);
                user.ChangePassword = false;

                _repository.Update(user);
                _repository.Save();
            }
             
            result.Result = true;

        }
        catch (Exception ex)
        {
            result.ErrorProvider.AddError(ex.Source, ex.GetBaseException().Message);
        }
        return result;
    }

    
   



}



