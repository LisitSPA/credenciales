using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.Extensions;
using Utility.Mappings;

namespace Application.Collaborators.Queries.DTOs
{
    public class CollaboratorDEDto : IMapFrom<Collaborator>
    {
        public int Id { get; set; }
        public string RUT { get; set; }
        public string CompleteName { get; set; }
        public string Area { get; set; }
        public int LeadershipId { get; set; }
        public int SegmentId { get; set; }
        public string Position { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public string Leadership { get; set; }
        public string Segment { get; set; }
        public string Role { get; set; }
        public string SegmentColor { get; set; }
        public List<Attachment> Attachments { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Collaborator, CollaboratorDEDto>()
            .ForMember(x => x.Leadership, opt => opt.MapFrom(s => s.Leadership.Name))
            .ForMember(x => x.Segment, opt => opt.MapFrom(s => s.Segment.Name))
            .ForMember(x => x.SegmentColor, opt => opt.MapFrom(s => s.Segment.Color))
            .ForMember(x => x.Role, opt => opt.MapFrom(s => s.User.ERoleUser))
            .ForMember(x => x.Status, opt => opt.MapFrom(s => s.ECollaboratorStatus.GetDescriptionByVal()));
        }
    }
}
