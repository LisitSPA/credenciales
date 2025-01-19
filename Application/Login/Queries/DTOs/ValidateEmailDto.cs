using AutoMapper;
using Domain.Entities;
using Utility.Mappings;

public class ValidateEmailDto : IMapFrom<User>
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }
    public string Password { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, ValidateEmailDto>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
    }
}

public class ValidateEmailResponseDto
{
    public ValidateEmailDto Data { get; set; }
    public bool Status { get; set; }
    public string Message { get; set; }
}