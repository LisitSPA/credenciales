
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class Leadership : BaseEntity
    {
        public string Name { get; set; }
    }
    
}