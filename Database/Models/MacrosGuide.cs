using System;

namespace Fit2Fitter.Database.Models
{
    public class MacrosGuide
    {
        public int Id { get; set; }
        public double Carb { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
        public int FV { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
