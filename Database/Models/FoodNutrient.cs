using System;

namespace Fit2Fitter.Database.Models
{
    public class FoodNutrient
    {
        public int Id { get; set; }
        public string FdcId { get; set; }
        public string NutrientId { get; set; }
        public double Amount { get; set; }
        public int DataPoint { get; set; }
        public string DerivationId { get; set; }
    }
}
