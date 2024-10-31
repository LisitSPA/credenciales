
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class User : BaseEntity
    {
        public int? CollaboratorId { get; set; }
        public ERoleUser ERoleUser { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool ChangePassword { get; set; }

        public Collaborator Collaborator { get; set; }
    }
    
}