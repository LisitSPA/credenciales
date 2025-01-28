using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.Mappings;

namespace Application.Users.Queries.DTOs
{
    public record UserLoginDto : IMapFrom<User>
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Collaborator Collaborator { get; set; }
        public ERoleUser ERoleUser { get; set; }
    }
}
