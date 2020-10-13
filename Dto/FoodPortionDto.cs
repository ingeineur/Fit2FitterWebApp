using System;

namespace Fit2Fitter.Database.Models
{
    public class FoodPortionDto
    {
        public string FdcId { get; set; }
        public string Modifier { get; set; }
        public double Amount { get; set; }
        public double GramWeight { get; set; }
        public double ProteinValue { get; set; }
        public double FatValue { get; set; }
        public double CarbValue { get; set; }
    }
}
