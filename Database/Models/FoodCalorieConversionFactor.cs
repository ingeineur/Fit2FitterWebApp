using System;

namespace Fit2Fitter.Database.Models
{
    public class FoodCalorieConversionFactor
    {
        public int Id { get; set; }
        public string FoodNutrientConversionFactorId { get; set; }
        public double ProteinValue { get; set; }
        public double FatValue { get; set; }
        public double CarbValue { get; set; }
    }
}
