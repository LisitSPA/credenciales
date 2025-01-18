using AutoMapper;
using Domain.Entities;
using Utility.Mappings;

public class ValidateEmailDto : IMapFrom<User>  
{
    public string Id { get; set; }
    public string Email { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, ValidateEmailDto>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
    }
}