using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;

namespace Fit2Fitter.Database.Contracts
{
    public interface IFoodRepository
    {
        Task<IEnumerable<Models.FoodLegacyItem>> FindFoods(string keyword);

        Task<IEnumerable<Models.FoodPortionLegacyItem>> FindPortions(string fdcId);

        Task<IEnumerable<Models.FoodNutrientConversionFactor>> FindNutrientConversionFactor(string fdcId);

        Task<IEnumerable<Models.FoodCalorieConversionFactor>> FindCalorieConversionFactor(string conversionId);

        Task<IEnumerable<Models.FoodNutrient>> FindFoodNutrients(string fdcId, string nutrientId);

        Task<IEnumerable<Models.AnzFoodNutrient>> FindAnzFoods(string keyword);

        Task<Models.AnzFoodNutrient> FindAnzFoodsByKey(string foodKey);

        Task<IEnumerable<Models.AnzFoodMeasure>> FindAnzPortions(string foodKey);

        Task<IEnumerable<Models.Recipe>> FindRecipes(int clientId, string keyword);

        Task<IEnumerable<Models.RecipeItem>> GetRecipeItems(int recipeId);

        Task<int> AddUpdateRecipe(Recipe recipe);

        Task DeleteRecipe(int recipeId);

        Task DeleteRecipeItems(int recipeId);

        Task AddUpdateRecipeItem(RecipeItem recipeItem);
    }
}
