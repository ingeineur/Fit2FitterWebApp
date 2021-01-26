using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Contracts;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;
using Fit2Fitter.Services.Contracts;

namespace Fit2Fitter.Services.Implementation
{
    public class TrackerService:ITrackerService
    {
        private readonly IClientRepository clientRepository;
        private readonly ITrackerRepository trackerRepository;

        public TrackerService(IClientRepository clientRepository, ITrackerRepository trackerRepository)
        {
            this.clientRepository = clientRepository;
            this.trackerRepository = trackerRepository;
        }

        public async Task<bool> AddActivity(ActivityDto activity)
        {
            try
            {
                if (activity.Id < 1)
                {
                    await this.trackerRepository.AddActivity(new Activity
                    {
                        ClientId = activity.ClientId,
                        Calories = activity.Calories,
                        Steps = activity.Steps,
                        MaxHr = activity.MaxHr,
                        Duration = activity.Duration,
                        Description = activity.Description,
                        Updated = DateTime.Now,
                        Created = activity.Created
                    }).ConfigureAwait(false);
                }
                else
                {
                    await this.trackerRepository.UpdateActivity(new Activity
                    {
                        Id = activity.Id,
                        ClientId = activity.ClientId,
                        Calories = activity.Calories,
                        Steps = activity.Steps,
                        MaxHr = activity.MaxHr,
                        Duration = activity.Duration,
                        Description = activity.Description,
                        Updated = activity.Updated,
                        Created = activity.Created
                    }).ConfigureAwait(false);
                }

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddMeal(MealDto meal)
        {
            try
            {
                await this.trackerRepository.AddMeal(new Meal
                {
                    Id = meal.Id,
                    MealType = meal.MealType,
                    MacroType = meal.MacroType,
                    MealDesc = meal.MealDesc,
                    MacroValue = meal.MacroValue,
                    Updated = DateTime.Now,
                    Created = meal.Created,
                    ClientId = meal.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddComment(CommentDto comment)
        {
            try
            {
                await this.trackerRepository.AddComment(new Comment
                {
                    Id = comment.Id,
                    MeasurementRef = comment.MeasurementRef,
                    MealsRef = comment.MealsRef,
                    ActivitiesRef = comment.ActivitiesRef,
                    Message = comment.Message,
                    ReadStatus = comment.ReadStatus,
                    Updated = DateTime.Now,
                    Created = comment.Created,
                    FromId = comment.FromId,
                    ClientId = comment.ClientId
                }).ConfigureAwait(false);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> AddMacrosGuide(MacrosGuideDto macrosGuide)
        {
            try
            {
                if (macrosGuide.Id < 1)
                {
                    await this.trackerRepository.AddMacroGuide(new MacrosGuide
                    {
                        Food = macrosGuide.Food,
                        MealType = macrosGuide.MealType,
                        Carb = macrosGuide.Carb,
                        Protein = macrosGuide.Protein,
                        Fat = macrosGuide.Fat,
                        FV = macrosGuide.FV,
                        Updated = DateTime.Now,
                        Created = macrosGuide.Created,
                        ClientId = macrosGuide.ClientId
                    }).ConfigureAwait(false);
                }
                else
                {
                    await this.trackerRepository.UpdateMacroGuide(new MacrosGuide
                    {
                        Id = macrosGuide.Id,
                        Food = macrosGuide.Food,
                        MealType = macrosGuide.MealType,
                        Carb = macrosGuide.Carb,
                        Protein = macrosGuide.Protein,
                        Fat = macrosGuide.Fat,
                        FV = macrosGuide.FV,
                        Updated = DateTime.Now,
                        Created = macrosGuide.Created,
                        ClientId = macrosGuide.ClientId
                    }).ConfigureAwait(false);
                }
                
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<IEnumerable<ActivityDto>> GetActivities(int clientId, DateTime date)
        {
            var activities = await this.trackerRepository.FindActivities(clientId, date).ConfigureAwait(false);
            return activities.Select(activity => new ActivityDto
            {
                Id = activity.Id,
                Calories = activity.Calories,
                Steps = activity.Steps,
                MaxHr = activity.MaxHr,
                Duration = activity.Duration,
                Description = activity.Description,
                Updated = activity.Updated,
                Created = activity.Created,
                ClientId = activity.ClientId
            });
        }

        public async Task<IEnumerable<ActivityDto>> GetActivities(DateTime date)
        {
            var activities = await this.trackerRepository.FindActivities(date).ConfigureAwait(false);
            Dictionary<int, ActivityDto> tmp = new Dictionary<int, ActivityDto>();
            activities.ToList().ForEach(a => {
                if (tmp.Keys.Contains(a.ClientId))
                {
                    tmp[a.ClientId].Steps += a.Steps;
                    tmp[a.ClientId].Calories += a.Calories;
                }
                else
                {
                    tmp[a.ClientId] = new ActivityDto {
                        Id = a.Id,
                        Calories = a.Calories,
                        Steps = a.Steps,
                        Duration = a.Duration,
                        Description = a.Description,
                        Updated = a.Updated,
                        Created = a.Created,
                        ClientId = a.ClientId
                    };
                }
            });

            return tmp.Values.ToArray();
        }

        public async Task<IEnumerable<MealDto>> GetMeals(int clientId, DateTime date)
        {
            var meals = await this.trackerRepository.FindMeals(clientId, date).ConfigureAwait(false);
            return meals.Select(meal => new MealDto
            {
                Id = meal.Id,
                MealType = meal.MealType,
                MacroType = meal.MacroType,
                MealDesc = meal.MealDesc,
                MacroValue = meal.MacroValue,
                Updated = meal.Updated,
                Created = meal.Created,
                ClientId = meal.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetAllComments(int clientId, bool sent, int mealsRef)
        {
            var comments = await this.trackerRepository.FindAllComments(clientId, sent, mealsRef).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals(int clientId)
        {
            var comments = await this.trackerRepository.FindAllCommentsMeals(clientId).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals(DateTime date)
        {
            var comments = await this.trackerRepository.FindAllCommentsMeals(date).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsMeals(int clientId, DateTime date)
        {
            var comments = await this.trackerRepository.FindCommentsMeals(clientId, date).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeasurements(DateTime date)
        {
            var comments = await this.trackerRepository.FindAllCommentsMeasurements(date).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsMeasurements(int clientId, DateTime date)
        {
            var comments = await this.trackerRepository.FindCommentsMeasurements(clientId, date).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetComments(int clientId, bool readStatus)
        {
            var comments = await this.trackerRepository.FindComment(clientId, readStatus).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<CommentDto>> GetComments(int clientId, DateTime date)
        {
            var comments = await this.trackerRepository.FindComment(clientId, date).ConfigureAwait(false);
            return comments.Select(comment => new CommentDto
            {
                Id = comment.Id,
                MeasurementRef = comment.MeasurementRef,
                MealsRef = comment.MealsRef,
                ActivitiesRef = comment.ActivitiesRef,
                Message = comment.Message,
                ReadStatus = comment.ReadStatus,
                Updated = comment.Updated,
                Created = comment.Created,
                FromId = comment.FromId,
                ClientId = comment.ClientId
            });
        }

        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, DateTime date)
        {
            var macrosGuides = await this.trackerRepository.FindMacroGuides(clientId, date).ConfigureAwait(false);
            return macrosGuides.Select(guide => new MacrosGuideDto
            {
                Id = guide.Id,
                Food = guide.Food,
                MealType = guide.MealType,
                Carb = guide.Carb,
                Protein = guide.Protein,
                Fat = guide.Fat,
                FV = guide.FV,
                Updated = guide.Updated,
                Created = guide.Created,
                ClientId = guide.ClientId
            });
        }

        private double GetNutrientValue(IEnumerable<FoodNutrient> nutrients)
        {
            if (nutrients == null)
            {
                return 0.0;
            }

            if (nutrients.FirstOrDefault() == null)
            {
                return 0.0;
            }

            return nutrients.First().Amount;
        }

        public async Task<IEnumerable<FoodLegacyItemDto>> GetFoods(string keyword)
        {
            var results = await this.trackerRepository.FindFoods(keyword).ConfigureAwait(false);
            //var res = results.ToList().OrderBy(y => y.Description.StartsWith(keyword, StringComparison.OrdinalIgnoreCase))
            //  .ThenBy(x => x);

            var results2 = results.Select(Value => new { Value, Index = Value.Description.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase) })
                   .Where(pair => pair.Index >= 0)
                   .OrderBy(pair => pair.Index)
                   .Select(pair => pair.Value);

            List<FoodLegacyItem> temp = new List<FoodLegacyItem>();
            int i = 0;
            foreach (var f in results2)
            {
                temp.Add(f);
                if (i > 20)
                { 
                    break; 
                }
                i++;
            }

            return temp.Select( food => new FoodLegacyItemDto { 
                FdcId = food.FdcId,
                Description = food.Description
            });
        }

        public async Task<IEnumerable<FoodPortionDto>> GetFoodPortions(string fdcId)
        {
            var portions = await this.trackerRepository.FindPortions(fdcId).ConfigureAwait(false);
            List<FoodPortionDto> dtos = new List<FoodPortionDto>();
            var carbs = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1005").ConfigureAwait(false));
            var protein = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1003").ConfigureAwait(false));
            var fat = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1004").ConfigureAwait(false));

            var sugar = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1063").ConfigureAwait(false));
            var sucrose = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1010").ConfigureAwait(false));
            var glucose = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1011").ConfigureAwait(false));
            var fruitose = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1012").ConfigureAwait(false));

            var fiber = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1079").ConfigureAwait(false));
            var water = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1051").ConfigureAwait(false));

            var vA = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1105").ConfigureAwait(false));
            var vB6 = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1175").ConfigureAwait(false));
            var vC = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1162").ConfigureAwait(false));
            var vD = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1110").ConfigureAwait(false));

            var calcium = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1087").ConfigureAwait(false));
            var iron = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1089").ConfigureAwait(false));
            var potassium = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1092").ConfigureAwait(false));
            var zinc = this.GetNutrientValue(await this.trackerRepository.FindFoodNutrients(fdcId, "1095").ConfigureAwait(false));

            if (carbs == 0.0 && 
                protein == 0.0 && 
                fat == 0.0)
            {
                return dtos;
            }

            foreach (var portion in portions)
            {
                dtos.Add(new FoodPortionDto
                {
                    FdcId = fdcId,
                    Amount = string.IsNullOrEmpty(portion.Amount) == false ? double.Parse(portion.Amount) : 1.0,
                    Modifier = portion.Modifier,
                    GramWeight = portion.GramWeight,
                    CarbValue = carbs/100,
                    ProteinValue = protein/100,
                    FatValue = fat/100,
                    SugarValue = (sugar / 100) + (sucrose / 100) + (fruitose / 100) + (glucose / 100),
                    FiberValue = fiber/100,
                    WaterValue = water/100,
                    VitaminAValue = vA/100,
                    VitaminB6Value = vB6/100,
                    VitaminCValue = vC/100,
                    VitaminDValue = vD/100,
                    CalciumValue = calcium/100,
                    IronValue = iron/100,
                    PotassiumValue = potassium / 100,
                    ZincValue = zinc/100
                });
            }

            dtos.Add(new FoodPortionDto
            {
                FdcId = fdcId,
                Amount = 1.0,
                Modifier = "one gram",
                GramWeight = 1.0,
                CarbValue = carbs / 100,
                ProteinValue = protein / 100,
                FatValue = fat / 100,
                SugarValue = (sugar / 100) + (sucrose / 100) + (fruitose / 100) + (glucose / 100),
                FiberValue = fiber / 100,
                WaterValue = water / 100,
                VitaminAValue = vA / 100,
                VitaminB6Value = vB6 / 100,
                VitaminCValue = vC / 100,
                VitaminDValue = vD / 100,
                CalciumValue = calcium / 100,
                IronValue = iron / 100,
                PotassiumValue = potassium / 100,
                ZincValue = zinc / 100
            });

            dtos.Add(new FoodPortionDto
            {
                FdcId = fdcId,
                Amount = 1.0,
                Modifier = "hundred gram",
                GramWeight = 100.0,
                CarbValue = carbs / 100,
                ProteinValue = protein / 100,
                FatValue = fat / 100,
                SugarValue = (sugar / 100) + (sucrose / 100) + (fruitose / 100) + (glucose / 100),
                FiberValue = fiber / 100,
                WaterValue = water / 100,
                VitaminAValue = vA / 100,
                VitaminB6Value = vB6 / 100,
                VitaminCValue = vC / 100,
                VitaminDValue = vD / 100,
                CalciumValue = calcium / 100,
                IronValue = iron / 100,
                PotassiumValue = potassium / 100,
                ZincValue = zinc / 100
            });

            return dtos;
        }

        public async Task<bool> DeleteMeals(int clientId, DateTime date)
        {
            try
            {
                await this.trackerRepository.DeleteMeals(clientId, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteActivities(int clientId, DateTime date)
        {
            try
            {
                await this.trackerRepository.DeleteActivities(clientId, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteActivities(int clientId, IEnumerable<int> activityIds)
        {
            try
            {
                await this.trackerRepository.DeleteActivities(clientId, activityIds).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteComment(int commentId)
        {
            try
            {
                await this.trackerRepository.DeleteComment(commentId).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateComment(int commentId, bool read)
        {
            try
            {
                await this.trackerRepository.UpdateComment(commentId, read).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCommentMeals(int clientId, bool read, DateTime date)
        {
            try
            {
                await this.trackerRepository.UpdateCommentMeals(clientId, read, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCommentMeals(int clientId, int fromClientId, bool read, DateTime date)
        {
            try
            {
                await this.trackerRepository.UpdateCommentMeals(clientId, fromClientId, read, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCommentMeasurements(int clientId, bool read, DateTime date)
        {
            try
            {
                await this.trackerRepository.UpdateCommentMeasurements(clientId, read, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateCommentMeasurements(int clientId, int fromClientId, bool read, DateTime date)
        {
            try
            {
                await this.trackerRepository.UpdateCommentMeasurements(clientId, fromClientId, read, date).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteMacroGuide(int macroGuideId)
        {
            try
            {
                await this.trackerRepository.DeleteMacroGuide(macroGuideId).ConfigureAwait(false);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateMacroGuides(IEnumerable<MacrosGuideDto> macroGuides, DateTime created)
        {
            try
            {
                foreach (var guide in macroGuides)
                {
                    await this.trackerRepository.UpdateMacroGuide(new MacrosGuide
                    {
                        Id = guide.Id,
                        Food = guide.Food,
                        MealType = guide.MealType,
                        Carb = guide.Carb,
                        Protein = guide.Protein,
                        Fat = guide.Fat,
                        FV = guide.FV,
                        Updated = DateTime.Now,
                        Created = created,
                        ClientId = guide.ClientId
                    }).ConfigureAwait(false);
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
