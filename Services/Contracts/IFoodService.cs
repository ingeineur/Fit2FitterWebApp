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
        Task<int> AddRecipe(RecipeDto recipe);
        Task<bool> AddRecipeItems(IEnumerable<RecipeItemDto> recipeItem);
        Task<IEnumerable<RecipeDto>> GetRecipes(int clientId, string keyword);
        Task<IEnumerable<RecipeItemDto>> GetRecipeItems(int recipeId);
        Task<bool> DeleteRecipe(int recipeId);
    }
}
