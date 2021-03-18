namespace Fit2Fitter.Database.Models
{
    public class AnzFoodMeasure
    {
        public int Id { get; set; }
        public string FoodKey { get; set; }
        public string FoodSurvey { get; set; }
        public string MeasureId { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public double Weight { get; set; }
    }
}
