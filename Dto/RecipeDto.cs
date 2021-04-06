namespace Fit2Fitter.Dto
{
    using System;

    public class RecipeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Carbs { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
        public double Serving { get; set; }
        public string Photo { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
