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
    }
}
