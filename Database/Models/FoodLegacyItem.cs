using System;

namespace Fit2Fitter.Database.Models
{
    public class FoodLegacyItem
    {
        public int Id { get; set; }
        public string FdcId { get; set; }
        public string DataType { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
