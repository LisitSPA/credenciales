using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAS.Domain.DTOs
{
    public class RowWithError
    {
        public int RowNumber { get; set; }
        public List<string> Messsages { get; set; }
    }

    public class RowSuccess : MassiveDataDto
    {
        public int RowNumber { get; set; }
    }
    public class MassiveDataDto
    {
        public List<RowWithError> Errors { get; set; }
        public List<RowSuccess> Success { get; set; }
    }
}
