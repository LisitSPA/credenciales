using AutoMapper;
using Domain.Entities;
using Utility.Mappings;

public class UpdatePasswordDto : IMapFrom<User>
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string NewPassword { get; set; }
    public string Token { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<User, UpdatePasswordDto>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
    }
}
