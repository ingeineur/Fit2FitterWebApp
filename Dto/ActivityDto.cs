using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fit2Fitter.Database.Models
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public int Calories { get; set; }
        public int Steps { get; set; }
        public int MaxHr { get; set; }
        public double Duration { get; set; }
        public string Description { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
