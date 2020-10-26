﻿using System;
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

        public async System.Threading.Tasks.Task<IEnumerable<Models.Measurement>> FindMeasurements(int clientId)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Measurements.Where(x =>
                x.ClientId == clientId).ToArrayAsync().ConfigureAwait(false);
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

        public async System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllComments(int clientId, bool sent, int mealsRef)
        {
            if(sent == true)
            {
                return await this.databaseContext.Comments.Where(x =>
                x.FromId == clientId && x.MealsRef == mealsRef).ToArrayAsync().ConfigureAwait(false);
            }

            return await this.databaseContext.Comments.Where(x =>
                x.ClientId == clientId && x.MealsRef == mealsRef).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllCommentsMeals(int clientId)
        {
            return await this.databaseContext.Comments.Where(x =>
                (x.ClientId == clientId || x.FromId == clientId) && x.MealsRef == 1).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindCommentsMeals(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Comments.Where(x =>
                (x.ClientId == clientId || x.FromId == clientId) && x.MealsRef == 1 && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindComment(int clientId, bool readStatus)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Comments.Where(x =>
                x.ClientId == clientId && x.ReadStatus == readStatus).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindComment(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.Comments.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            return await this.databaseContext.MacrosGuides.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToArrayAsync().ConfigureAwait(false);
        }

        public async System.Threading.Tasks.Task<IEnumerable<Models.FoodLegacyItem>> FindFoods(string keyword)
        {
            //string[] categories = {"1", "4", "5", "6", "7", "8", "9", "11", "12", "13", "14", 
            //    "15", "16", "17", "18", "20", "22", "25"};
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

        public async Task AddComment(Comment comment)
        {
            if (await this.clientRepository.FindClientById(comment.ClientId).ConfigureAwait(false) != null)
            {
                // check if logging message
                if (comment.Message == "Log meals for today")
                {
                    var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
                    var result = await this.databaseContext.Comments.Where(x =>
                    x.ClientId == comment.ClientId && x.FromId == comment.FromId && x.Message == comment.Message && x.MealsRef == 1 && DbF.DateDiffDay(x.Created, comment.Created) == 0).ToListAsync().ConfigureAwait(false);

                    if (result.Count < 1)
                    {
                        await this.databaseContext.Comments.AddAsync(comment).ConfigureAwait(false);
                        await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
                    }
                }
                else
                {
                    await this.databaseContext.Comments.AddAsync(comment).ConfigureAwait(false);
                    await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
                }
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
            var result = await this.databaseContext.MacrosGuides.SingleOrDefaultAsync(x =>
                x.ClientId == macrosGuide.ClientId && x.Id == macrosGuide.Id).ConfigureAwait(false);

            if (result != null)
            {
                result.Food = macrosGuide.Food;
                result.MealType = macrosGuide.MealType;
                result.Carb = macrosGuide.Carb;
                result.Protein = macrosGuide.Protein;
                result.Fat = macrosGuide.Fat;
                result.FV = macrosGuide.FV;
                result.Updated = macrosGuide.Updated;
                result.Created = macrosGuide.Created;
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

        public async Task DeleteMacroGuides(int clientId, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.MacrosGuides.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.MacrosGuides.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task DeleteMacroGuide(int macroGuideId)
        {
            var result = await this.databaseContext.MacrosGuides.Where(x =>
                x.Id == macroGuideId).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.MacrosGuides.RemoveRange(result);
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

        public async Task DeleteComment(int commentId)
        {
            var result = await this.databaseContext.Comments.Where(x =>
                x.Id == commentId).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                this.databaseContext.Comments.RemoveRange(result);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateComment(int commentId, bool read)
        {
            var result = await this.databaseContext.Comments.Where(x =>
                x.Id == commentId).SingleOrDefaultAsync().ConfigureAwait(false);

            if (result != null)
            {
                result.ReadStatus = read;
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }

        public async Task UpdateCommentMeals(int clientId, bool read, DateTime date)
        {
            var DbF = Microsoft.EntityFrameworkCore.EF.Functions;
            var result = await this.databaseContext.Comments.Where(x =>
                x.ClientId == clientId && DbF.DateDiffDay(x.Created, date) == 0).ToListAsync().ConfigureAwait(false);

            if (result != null)
            {
                result.ForEach(x => x.ReadStatus = read);
                await this.databaseContext.SaveChangesAsync().ConfigureAwait(false);
            }
        }
    }
}
