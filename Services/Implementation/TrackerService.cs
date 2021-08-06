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
                        Photo = macrosGuide.Photo,
                        Food = macrosGuide.Food,
                        MealType = macrosGuide.MealType,
                        Carb = macrosGuide.Carb,
                        Protein = macrosGuide.Protein,
                        Fat = macrosGuide.Fat,
                        Portion = macrosGuide.Portion,
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
                        Photo = macrosGuide.Photo,
                        Food = macrosGuide.Food,
                        MealType = macrosGuide.MealType,
                        Carb = macrosGuide.Carb,
                        Protein = macrosGuide.Protein,
                        Fat = macrosGuide.Fat,
                        Portion = macrosGuide.Portion,
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

        public async Task<IEnumerable<ActivityDto>> GetActivities(int clientId, DateTime fromDate, DateTime toDate)
        {
            var activities = await this.trackerRepository.FindActivities(clientId, fromDate, toDate).ConfigureAwait(false);

            List<ActivityDto> results = new List<ActivityDto>();
            var days = (toDate - fromDate).Days;
            DateTime date = DateTime.Parse(fromDate.ToString());
            while(date <= toDate)
            {
                var act = activities.Where(x => Math.Abs((x.Created - date).TotalHours) <= 12);
                if (act.Any())
                {
                    results.Add(new ActivityDto
                    {
                        Id = 0,
                        Calories = act.Select(x => x.Calories).Aggregate((result, item) => result + item),
                        Steps = act.Select(x => x.Steps).Aggregate((result, item) => result + item),
                        MaxHr = act.Select(x => x.MaxHr).Max(),
                        Duration = act.Select(x => x.Duration).Aggregate((result, item) => result + item),
                        Description = "Aggregation",
                        Updated = act.First().Updated,
                        Created = act.First().Created,
                        ClientId = clientId
                    });
                }
                else
                {
                    results.Add(new ActivityDto
                    {
                        Id = 0,
                        Calories = 0,
                        Steps = 0,
                        MaxHr = 0,
                        Duration = 0.0,
                        Description = "Aggregation",
                        Updated = DateTime.Now,
                        Created = date,
                        ClientId = clientId
                    });
                }

                date = date.AddDays(1.0);
            }

            return results;
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

        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals(int clientId, bool readStatus)
        {
            var comments = await this.trackerRepository.FindAllCommentsMeals(clientId, readStatus).ConfigureAwait(false);
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

        public async Task<IEnumerable<CommentDto>> GetCommentsMeals(int clientId, DateTime date, bool readStatus)
        {
            var comments = await this.trackerRepository.FindCommentsMeals(clientId, date, readStatus).ConfigureAwait(false);
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

        public async Task<IEnumerable<CommentDto>> GetCommentsMeasurements(int clientId, DateTime date, bool readStatus)
        {
            var comments = await this.trackerRepository.FindCommentsMeasurements(clientId, date, readStatus).ConfigureAwait(false);
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
                Photo = guide.Photo,
                Food = guide.Food,
                MealType = guide.MealType,
                Carb = guide.Carb,
                Protein = guide.Protein,
                Fat = guide.Fat,
                Portion = guide.Portion,
                FV = guide.FV,
                Updated = guide.Updated,
                Created = guide.Created,
                ClientId = guide.ClientId
            });
        }

        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, DateTime fromDate, DateTime toDate)
        {
            var macrosGuides = await this.trackerRepository.FindMacroGuides(clientId, fromDate, toDate).ConfigureAwait(false);

            List<MacrosGuideDto> results = new List<MacrosGuideDto>();
            var days = (toDate - fromDate).Days;
            DateTime date = DateTime.Parse(fromDate.ToString());
            while (date <= toDate)
            {
                var meals = macrosGuides.Where(x => Math.Abs((x.Created - date).TotalHours) <= 12);
                if (meals.Any())
                {
                    results.Add(new MacrosGuideDto
                    {
                        Id = 0,
                        Photo = "",
                        Food = "Aggregation",
                        MealType = "Aggregation",
                        Carb = meals.Select(x => x.Carb).Aggregate((result, item) => result + item),
                        Protein = meals.Select(x => x.Protein).Aggregate((result, item) => result + item),
                        Fat = meals.Select(x => x.Fat).Aggregate((result, item) => result + item),
                        Portion = meals.Select(x => x.Portion).Aggregate((result, item) => result + item),
                        FV = meals.Select(x => x.FV).Aggregate((result, item) => result + item),
                        Updated = meals.First().Updated,
                        Created = meals.First().Created,
                        ClientId = clientId
                    });
                }
                else
                {
                    results.Add(new MacrosGuideDto
                    {
                        Id = 0,
                        Photo = "",
                        Food = "Aggregation",
                        MealType = "Aggregation",
                        Carb = 0,
                        Protein = 0,
                        Fat = 0,
                        Portion = 0,
                        FV = 0,
                        Updated = DateTime.Now,
                        Created = date,
                        ClientId = clientId
                    });
                }

                date = date.AddDays(1.0);
            }

            return results;
        }

        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, string keyword)
        {
            try
            {
                var macrosGuides = await this.trackerRepository.FindMacroGuides(clientId, keyword).ConfigureAwait(false);

                if (macrosGuides == null)
                {
                    return new List<MacrosGuideDto>();
                }

                var results = macrosGuides.Select(Value => new { Value, Index = Value.Food.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase) })
                       .Where(pair => pair.Index >= 0)
                       .OrderBy(pair => pair.Index)
                       .Select(pair => pair.Value);

                List<MacrosGuideDto> temp = new List<MacrosGuideDto>();
                int i = 0;
                foreach (var guide in results)
                {
                    temp.Add(new MacrosGuideDto
                    {
                        Id = guide.Id,
                        Photo = guide.Photo,
                        Food = guide.Food,
                        MealType = guide.MealType,
                        Carb = guide.Carb,
                        Protein = guide.Protein,
                        Fat = guide.Fat,
                        Portion = guide.Portion,
                        FV = guide.FV,
                        Updated = guide.Updated,
                        Created = guide.Created,
                        ClientId = guide.ClientId
                    });

                    if (i++ > 20)
                    {
                        break;
                    }
                }

                return temp;
            }
            catch (Exception ex)
            {
                return new List<MacrosGuideDto>();
            }
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
                        Photo = guide.Photo,
                        Food = guide.Food,
                        MealType = guide.MealType,
                        Carb = guide.Carb,
                        Protein = guide.Protein,
                        Fat = guide.Fat,
                        Portion = guide.Portion,
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
