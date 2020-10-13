using System;

namespace Fit2Fitter.Database.Models
{
    public class FoodPortionLegacyItem
    {
        public int Id { get; set; }
        public string FoodPortionId { get; set; }
        public string FdcId { get; set; }
        public string SeqNum { get; set; }
        public string Amount { get; set; }
        public string MeasureUnitId { get; set; }
        public string PortionDescription { get; set; }
        public string Modifier { get; set; }
        public double GramWeight { get; set; }
    }
}
