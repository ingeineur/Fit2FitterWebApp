namespace Fit2Fitter.Database.Models
{
    public class AnzFoodMeasureDto
    {
        public string FoodKey { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public double Weight { get; set; }
        public double ProteinValue { get; set; }
        public double FatValue { get; set; }
        public double CarbValue { get; set; }
        public double SugarValue { get; set; }
        public double WaterValue { get; set; }
        public double StarchValue { get; set; }
        public double SaturatedFattyAcidsValue { get; set; }
    }
}
