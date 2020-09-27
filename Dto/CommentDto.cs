using System;

namespace Fit2Fitter.Dto
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int MeasurementRef { get; set; }
        public int MealsRef { get; set; }
        public int ActivitiesRef { get; set; }
        public bool ReadStatus { get; set; }
        public string Message { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int FromId { get; set; }
        public int ClientId { get; set; }
    }
}
