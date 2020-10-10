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
                await this.trackerRepository.AddActivity(new Activity
                {
                    ClientId = activity.ClientId,
                    Calories = activity.Calories,
                    Steps = activity.Steps,
                    Description = activity.Description,
                    Updated = DateTime.Now,
                    Created = activity.Created
                }).ConfigureAwait(false);

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

        public async Task<IEnumerable<CommentDto>> GetAllComments(int clientId, bool sent)
        {
            var comments = await this.trackerRepository.FindAllComments(clientId, sent).ConfigureAwait(false);
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
