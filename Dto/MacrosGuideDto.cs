using System;

namespace Fit2Fitter.Dto
{
    public class MacrosGuideDto
    {
        public int Id { get; set; }
        public string Food { get; set; }
        public string MealType { get; set; }
        public double Carb { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
        public int FV { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
