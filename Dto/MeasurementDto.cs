using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fit2Fitter.Dto
{
    public class MeasurementDto
    {
        public int Id { get; set; }
        public double Neck { get; set; }
        public double UpperArm { get; set; }
        public double Waist { get; set; }
        public double Hips { get; set; }
        public double Thigh { get; set; }
        public double Chest { get; set; }
        public double Weight { get; set; }
        public double BodyFat { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Created { get; set; }
        public int ClientId { get; set; }
    }
}
