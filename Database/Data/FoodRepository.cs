using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fit2Fitter.Database.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Fit2Fitter.Database.Data
{
    public class FoodRepository:IFoodRepository
    {
        private readonly DatabaseContext databaseContext;
        private readonly IClientRepository clientRepository;
        
        public FoodRepository(DatabaseContext databaseContext, IClientRepository clientRepository)
        {
            this.databaseContext = databaseContext;
            this.clientRepository = clientRepository;
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.FoodLegacyItem>> FindFoods(string keyword)
        {
            return await this.databaseContext.FoodLegacy.Where(x =>
                x.Description.Contains(keyword)).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.FoodPortionLegacyItem>> FindPortions(string fdcId)
        {
            return await this.databaseContext.FoodPortionsLegacy.Where(x =>
                x.FdcId == fdcId).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.FoodNutrientConversionFactor>> FindNutrientConversionFactor(string fdcId)
        {
            return await this.databaseContext.FoodNutrientConversionFactor.Where(x =>
                x.FdcId == fdcId).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.FoodCalorieConversionFactor>> FindCalorieConversionFactor(string conversionId)
        {
            return await this.databaseContext.FoodCalorieConversionFactor.Where(x =>
                x.FoodNutrientConversionFactorId == conversionId).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.FoodNutrient>> FindFoodNutrients(string fdcId, string nutrientId)
        {
            return await this.databaseContext.FoodNutrients.Where(x =>
                x.FdcId == fdcId && x.NutrientId == nutrientId).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.AnzFoodNutrient>> FindAnzFoods(string keyword)
        {
            return await this.databaseContext.AnzFoodNutrients.Where(x =>
                x.Name.Contains(keyword)).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<Models.AnzFoodNutrient> FindAnzFoodsByKey(string foodKey)
        {
            return await this.databaseContext.AnzFoodNutrients.Where(x =>
                x.FoodKey.ToLower() == foodKey.ToLower()).FirstOrDefaultAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.AnzFoodMeasure>> FindAnzPortions(string foodKey)
        {
            return await this.databaseContext.AnzFoodMeasures.Where(x =>
                x.FoodKey.ToLower() == foodKey.ToLower()).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.Recipe>> FindRecipes(int clientId, string keyword)
        {
            return await this.databaseContext.Recipes.Where(x =>
                x.ClientId == clientId && x.Name.Contains(keyword)).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Models.RecipeItem>> GetRecipeItems(int recipeId)
        {
            return await this.databaseContext.RecipeItems.Where(x =>
                x.RecipeId == recipeId).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task<int> AddUpdateRecipe(Models.Recipe recipe)
        {
            var result = await this.databaseContext.Recipes.SingleOrDefaultAsync(x =>
                x.Id == recipe.Id).ConfigureAwait(false);

            if (result != null)
            {
                result.Name = recipe.Name;
                result.Photo = recipe.Photo;
                result.Carbs = recipe.Carbs;
                result.Protein = recipe.Protein;
                result.Fat = recipe.Fat;
                result.Serving = recipe.Serving;
                result.Updated = recipe.Updated;
                result.Created = recipe.Created;
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
                return result.Id;
            }
            else
            {
                await this.databaseContext.Recipes.AddAsync(recipe).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
                return recipe.Id;
            }
        }

        public async Task DeleteRecipe(int recipeId) 
        {
            var result = await this.databaseContext.Recipes.Where(x =>
                x.Id == recipeId).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                await this.DeleteRecipeItems(recipeId).ConfigureAwait(false);

                this.databaseContext.Recipes.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteRecipeItems(int recipeId)
        {
            var result = await this.databaseContext.RecipeItems.Where(x =>
                x.RecipeId == recipeId).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.RecipeItems.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddUpdateRecipeItem(Models.RecipeItem recipeItem) 
        {
            var result = await this.databaseContext.RecipeItems.SingleOrDefaultAsync(x =>
                x.Id == recipeItem.Id).ConfigureAwait(false);

            if (result != null)
            {
                result.Name = recipeItem.Name;
                result.DataSource = recipeItem.DataSource;
                result.ExternalId = recipeItem.ExternalId;
                result.Weight = recipeItem.Weight;
                result.Carbs = recipeItem.Carbs;
                result.Protein = recipeItem.Protein;
                result.Fat = recipeItem.Fat;
                result.Updated = recipeItem.Updated;
                result.Created = recipeItem.Created;
                result.RecipeId = recipeItem.RecipeId;
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
            else
            {
                await this.databaseContext.RecipeItems.AddAsync(recipeItem).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }
    }
}
