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

        Task<IEnumerable<ActivityDto>> GetActivities(int clientId, DateTime fromDate, DateTime toDate);

        Task<IEnumerable<ActivityDto>> GetActivities(DateTime date);

        Task<IEnumerable<CommentDto>> GetAllComments(int clientId, bool sent, int mealsRef);

        Task<IEnumerable<CommentDto>> GetAllCommentsMeals(int clientId);

        Task<IEnumerable<CommentDto>> GetAllCommentsMeals(DateTime date);

        Task<IEnumerable<CommentDto>> GetCommentsMeals(int clientId, DateTime date);

        Task<IEnumerable<CommentDto>> GetAllCommentsMeasurements(DateTime date);

        Task<IEnumerable<CommentDto>> GetCommentsMeasurements(int clientId, DateTime date);

        Task<IEnumerable<CommentDto>> GetComments(int clientId, bool readStatus);

        Task<IEnumerable<CommentDto>> GetComments(int clientId, DateTime date);

        Task<IEnumerable<MealDto>> GetMeals(int clientId, DateTime date);

        Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, DateTime date);

        Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, DateTime fromDate, DateTime toDate);

        Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, string keyword);

        Task<bool> DeleteMeals(int clientId, DateTime date);

        Task<bool> DeleteActivities(int clientId, DateTime date);

        Task<bool> DeleteActivities(int clientId, IEnumerable<int> activityIds);

        Task<bool> DeleteComment(int commentId);

        Task<bool> UpdateComment(int commentId, bool read);

        Task<bool> UpdateCommentMeals(int clientId, bool read, DateTime date);

        Task<bool> UpdateCommentMeals(int clientId, int fromClientId, bool read, DateTime date);

        Task<bool> UpdateCommentMeasurements(int clientId, bool read, DateTime date);

        Task<bool> UpdateCommentMeasurements(int clientId, int fromClientId, bool read, DateTime date);

        Task<bool> DeleteMacroGuide(int macroGuideId);

        Task<bool> UpdateMacroGuides(IEnumerable<MacrosGuideDto> macroGuides, DateTime created);
    }
}
