
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class Collaborator : BaseEntity
    {
        public string RUT { get; set; }
        public string CompleteName { get; set; }
        public string Area { get; set; } //sede
        public int? LeadershipId { get; set; }
        public int? SegmentId { get; set; }
        public string Position { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool? AceptaTerminosyCondiciones { get; set; }
        public DateTime? FechaTerminoyCondiciones { get; set; }
        public string IPTerminoyCondiciones { get; set; }
        public ECollaboratorStatus ECollaboratorStatus { get; set; }
    
        public Segment Segment { get; set; }
        public Leadership Leadership { get; set; }
        public List<Attachment> Attachments { get; set; }

        public virtual User User { get; set; }
    }
    
}