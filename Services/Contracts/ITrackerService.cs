using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;

namespace Fit2Fitter.Services.Contracts
{
    public interface ITrackerService
    {
        Task<bool> AddActivity(ActivityDto activity);

        Task<bool> AddMeal(MealDto meal);

        Task<bool> AddComment(CommentDto comment);

        Task<bool> AddMacrosGuide(MacrosGuideDto macrosGuide);

        Task<IEnumerable<ActivityDto>> GetActivities(int clientId, DateTime date);

        Task<IEnumerable<ActivityDto>> GetActivities(DateTime date);

        Task<IEnumerable<CommentDto>> GetAllComments(int clientId, bool sent);

        Task<IEnumerable<CommentDto>> GetComments(int clientId, bool readStatus);

        Task<IEnumerable<CommentDto>> GetComments(int clientId, DateTime date);

        Task<IEnumerable<MealDto>> GetMeals(int clientId, DateTime date);

        Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, DateTime date);

        Task<bool> DeleteMeals(int clientId, DateTime date);

        Task<bool> DeleteActivities(int clientId, DateTime date);

        Task<bool> DeleteComment(int commentId);

        Task<bool> UpdateComment(int commentId, bool read);
    }
}
