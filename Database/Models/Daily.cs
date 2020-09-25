using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fit2Fitter.Database.Models
{
    public class Daily
    {
        public int Id { get; set; }
        public string Breakfast { get; set; }
        public string Lunch { get; set; }
        public string Dinner { get; set; }
        public string Snack { get; set; }
        public int TCB { get; set; }
        public int TDS { get; set; }
        public string TW { get; set; }
        public double Macros { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
