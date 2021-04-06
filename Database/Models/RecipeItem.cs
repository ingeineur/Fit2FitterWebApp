namespace Fit2Fitter.Database.Models
{
    using System;

    public class RecipeItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DataSource { get; set; }
        public string ExternalId { get; set; }
        public double Weight { get; set; }
        public double Carbs { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int RecipeId { get; set; }
    }
}
