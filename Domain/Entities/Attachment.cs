
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{

    public class Attachment : BaseEntity
    {
        public int CollaboratorId { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string Base64 { get; set; }
        public string FileType { get; set; }
        public EAttachmentType EAttachmentType { get; set; }
    }
    
}