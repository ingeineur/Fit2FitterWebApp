namespace Fit2Fitter.Database.Models
{
    public class AnzFoodNutrient
    {
        public int Id { get; set; }
        public string FoodKey { get; set; }
        public string Classification { get; set; }
        public string Name { get; set; }
        public double Fat { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Moisture { get; set; }
        public double Sugars { get; set; }
        public double Starch { get; set; }
        public double SaturatedFattyAcids { get; set; }
    }
}
