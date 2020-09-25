using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Contracts;
using Fit2Fitter.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Fit2Fitter.Database.Data
{
    public class TrackerRepository:ITrackerRepository
    {
        private readonly DatabaseContext databaseContext;
        private readonly IClientRepository clientRepository;
        
        public TrackerRepository(DatabaseContext databaseContext, IClientRepository clientRepository)
        {
            this.databaseContext = databaseContext;
            this.clientRepository = clientRepository;
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Measurement>> FindMeasurement(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Measurements.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<Models.Measurement> FindMeasurementClosest(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Measurements.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) >= 0).OrderByDescending(x => x.Created).FirstOrDefaultAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Daily>> FindDaily(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Dailies.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) < 1).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Activity>> FindActivities(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Activities.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Activity>> FindActivities(DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Activities.Where(x =>
                DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Meal>> FindMeals(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Meals.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.MacrosGuides.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) < 1).ToArrayAsync().ConfigureAwait(false);
        }

        public async Task AddMeasurement(Measurement measurement)
        {
            if (await this.clientRepository.FindClientById(measurement.ClientId).ConfigureAwait(false) != null)
            {
                var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
                var result = await this.databaseContext.Measurements.Where(x =>
                    x.ClientId == measurement.ClientId && DbF.DateDiffDay(x.Created, measurement.Created) == 0).SingleOrDefaultAsync().ConfigureAwait(false);

                if (result != null)
                {
                    result.Neck = measurement.Neck;
                    result.UpperArm = measurement.UpperArm;
                    result.Chest = measurement.Chest;
                    result.Waist = measurement.Waist;
                    result.Hips = measurement.Hips;
                    result.Thigh = measurement.Thigh;
                    result.Weight = measurement.Weight;
                    await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
                }
                else
                {
                    await this.databaseContext.Measurements.AddAsync(measurement).ConfigureAwait(false);
                }
                
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateMeasurement(Measurement measurement)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Measurements.Where(x =>
                x.ClientId == measurement.ClientId && DbF.DateDiffDay(x.Created, measurement.Created) == 0).SingleOrDefaultAsync().ConfigureAwait(false);

            if (result != null)
            {
                result.Neck = measurement.Neck;
                result.UpperArm = measurement.UpperArm;
                result.Chest = measurement.Chest;
                result.Waist = measurement.Waist;
                result.Hips = measurement.Hips;
                result.Thigh = measurement.Thigh;
                result.Weight = measurement.Weight;
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddDaily(Daily daily)
        {
            if (await this.clientRepository.FindClientById(daily.ClientId).ConfigureAwait(false) != null)
            {
                await this.databaseContext.Dailies.AddAsync(daily).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddActivity(Activity activity)
        {
            if (await this.clientRepository.FindClientById(activity.ClientId).ConfigureAwait(false) != null)
            {
                await this.databaseContext.Activities.AddAsync(activity).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddMeal(Meal meal)
        {
            if (await this.clientRepository.FindClientById(meal.ClientId).ConfigureAwait(false) != null)
            {
                await this.databaseContext.Meals.AddAsync(meal).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task AddMacroGuide(MacrosGuide macrosGuide)
        {
            if (await this.clientRepository.FindClientById(macrosGuide.ClientId).ConfigureAwait(false) != null)
            {
                await this.databaseContext.MacrosGuides.AddAsync(macrosGuide).ConfigureAwait(false);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateActivity(Activity activity)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Activities.Where(x =>
                x.ClientId == activity.ClientId && DbF.DateDiffDay(x.Created, activity.Created) < 1).SingleOrDefaultAsync().ConfigureAwait(false);

            if (result != null)
            {
                activity.Id = result.Id;
                this.databaseContext.Activities.Update(activity);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateMeal(Meal meal)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Meals.Where(x =>
                x.ClientId == meal.ClientId && x.MealType == meal.MealType && DbF.DateDiffDay(x.Created, meal.Created) < 1).SingleOrDefaultAsync().ConfigureAwait(false);

            if (result != null)
            {
                meal.Id = result.Id;
                this.databaseContext.Meals.Update(meal);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateMacroGuide(MacrosGuide macrosGuide)
        {
            var result = await this.databaseContext.Measurements.SingleOrDefaultAsync(x =>
                x.ClientId == macrosGuide.ClientId).ConfigureAwait(false);

            if (result != null)
            {
                macrosGuide.Id = result.Id;
                this.databaseContext.MacrosGuides.Update(macrosGuide);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteMeals(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Meals.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.Meals.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteActivities(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Activities.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.Activities.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }
    }
}
