using System;

namespace Fit2Fitter.Database.Models
{
    public class Meal
    {
        public int Id { get; set; }
        public string MealType { get; set; }
        public string MacroType { get; set; }
        public string MealDesc { get; set; }
        public double MacroValue { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
