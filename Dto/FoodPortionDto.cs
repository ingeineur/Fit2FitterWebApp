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
        public double SugarValue { get; set; }
        public double FiberValue { get; set; }
        public double WaterValue { get; set; }
        public double VitaminAValue { get; set; }
        public double VitaminB6Value { get; set; }
        public double VitaminCValue { get; set; }
        public double VitaminDValue { get; set; }
        public double CalciumValue { get; set; }
        public double IronValue { get; set; }
        public double PotassiumValue { get; set; }
        public double ZincValue { get; set; }
        public double StarchValue { get; set; }
        public double SaturatedFattyAcidsValue { get; set; }
    }
}
