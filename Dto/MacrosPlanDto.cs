using System;

namespace Fit2Fitter.Dto
{
    public class MacrosPlanDto
    {
        public int Id { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public double TargetWeight { get; set; }
        public string MacroType { get; set; }
        public string ActivityLevel { get; set; }
        public double CarbPercent { get; set; }
        public double ProteinPercent { get; set; }
        public double FatPercent { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
