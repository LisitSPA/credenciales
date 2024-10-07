
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class Segment 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
    
}