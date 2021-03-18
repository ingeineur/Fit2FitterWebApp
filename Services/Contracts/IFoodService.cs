using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;

namespace Fit2Fitter.Services.Contracts
{
    public interface IFoodService
    {
        Task<IEnumerable<FoodLegacyItemDto>> GetFoods(string keyword);
        Task<IEnumerable<FoodPortionDto>> GetFoodPortions(string fdcId);
        Task<IEnumerable<FoodLegacyItemDto>> GetAnzFoods(string keyword);
        Task<IEnumerable<FoodPortionDto>> GetAnzFoodPortions(string foodKey);
    }
}
