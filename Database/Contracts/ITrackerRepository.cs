using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;

namespace Fit2Fitter.Database.Contracts
{
    public interface ITrackerRepository
    {
        /// <summary>
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Measurement>> FindMeasurement(int clientId, DateTime date);

        System.Threading.Tasks.Task<IEnumerable<Models.Measurement>> FindMeasurements(int clientId, DateTime fromDate, DateTime date);

        System.Threading.Tasks.Task<Models.Measurement> FindMeasurementClosest(int clientId, DateTime date);

        /// <summary>
        /// Finds the daily activity.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Daily>> FindDaily(int clientId, DateTime date);

        /// <summary>
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Activity>> FindActivities(int clientId, DateTime date);

        /// <summary>
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Activity>> FindActivities(int clientId, DateTime fromDate, DateTime toDate);

        /// <summary>
        /// Find all activities by date
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Activity>> FindActivities(DateTime date);

        /// <summary>
        /// Finds the daily activity.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Meal>> FindMeals(int clientId, DateTime date);

        /// <summary>
        /// Finds all comments.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="readStatus">Read status.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllComments(int clientId, bool sent, int mealsRef);

        /// <summary>
        /// Finds all comments on meals.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="readStatus">Read status.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllCommentsMeals(int clientId);

        /// <summary>
        /// Finds all comments on meals.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="readStatus">Read status.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllCommentsMeals(DateTime date);

        /// <summary>
        /// Finds all comments on meals by date.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">The meals date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindCommentsMeals(int clientId, DateTime date);

        /// <summary>
        /// Finds all comments on measurements by date.
        /// </summary>
        /// <param name="date">The meals date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindAllCommentsMeasurements(DateTime date);

        /// <summary>
        /// Finds all comments on measurements by clientid and date.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">The meals date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindCommentsMeasurements(int clientId, DateTime date);

        /// <summary>
        /// Finds the comments by read status.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="readStatus">Read status.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindComment(int clientId, bool readStatus);

        /// <summary>
        /// Finds the comments by read status and receive date.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">Received Date.</param>
        /// <param name="readStatus">Read status.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.Comment>> FindComment(int clientId, DateTime date);

        /// <summary>
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, DateTime date);

        /// <summary>
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, DateTime fromDate, DateTime toDate);

        /// <summary>
        /// Find meals by keyword
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, string keyword);

        /// <summary>
        /// Add a new client measurement.
        /// </summary>
        /// <param name="measurement"></param>
        /// <returns></returns>
        Task AddMeasurement(Measurement measurement);

        /// <summary>
        /// Update client measurement.
        /// </summary>
        /// <param name="measurement"></param>
        /// <returns></returns>
        Task UpdateMeasurement(Measurement measurement);

        /// <summary>
        /// Add a new login for a client.
        /// </summary>
        /// <param name="activity"></param>
        /// <returns></returns>
        Task AddDaily(Daily activity);

        /// <summary>
        /// Add a new activity measurement.
        /// </summary>
        /// <param name="activity"></param>
        /// <returns></returns>
        Task AddActivity(Activity activity);

        /// <summary>
        /// Add a new meal for a client.
        /// </summary>
        /// <param name="meal"></param>
        /// <returns></returns>
        Task AddMeal(Meal meal);

        /// <summary>
        /// Add a new macro guide for a client.
        /// </summary>
        /// <param name="macrosGuide"></param>
        /// <returns></returns>
        Task AddMacroGuide(MacrosGuide macrosGuide);

        /// <summary>
        /// Add a new comment for a client.
        /// </summary>
        /// <param name="macrosGuide"></param>
        /// <returns></returns>
        Task AddComment(Comment comment);

        /// <summary>
        /// Add a new activity measurement.
        /// </summary>
        /// <param name="activity"></param>
        /// <returns></returns>
        Task UpdateActivity(Activity activity);

        /// <summary>
        /// Add a new meal for a client.
        /// </summary>
        /// <param name="meal"></param>
        /// <returns></returns>
        Task UpdateMeal(Meal meal);

        /// <summary>
        /// Add a new macro guide for a client.
        /// </summary>
        /// <param name="macrosGuide"></param>
        /// <returns></returns>
        Task UpdateMacroGuide(MacrosGuide macrosGuide);

        /// <summary>
        /// Delete client meals by date
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task DeleteMeals(int clientId, DateTime date);

        /// <summary>
        /// Delete client macro guides by date
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task DeleteMacroGuides(int clientId, DateTime date);

        /// <summary>
        /// Delete MacroGuide by Id
        /// </summary>
        /// <param name="macroGuideId">id</param>
        /// <returns></returns>
        Task DeleteMacroGuide(int macroGuideId);

        /// <summary>
        /// Delete client activities by list of ids
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="activityIds"></param>
        /// <returns></returns>
        Task DeleteActivities(int clientId, IEnumerable<int> activityIds);

        /// <summary>
        /// Delete client activities by date
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task DeleteActivities(int clientId, DateTime date);

        /// <summary>
        /// Delete a comment
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task DeleteComment(int commentId);

        /// <summary>
        /// Update comment's read status
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="read"></param>
        /// <returns></returns>
        Task UpdateComment(int commentId, bool read);

        /// <summary>
        /// Update comment's read status
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="read"></param>
        /// <returns></returns>
        Task UpdateCommentMeals(int clientId, bool read, DateTime date);

        /// <summary>
        /// Update comment's read status
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="read"></param>
        /// <returns></returns>
        Task UpdateCommentMeals(int clientId, int fromClientId, bool read, DateTime date);

        /// <summary>
        /// Update comment's read status
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="read"></param>
        /// <returns></returns>
        Task UpdateCommentMeasurements(int clientId, bool read, DateTime date);

        /// <summary>
        /// Update comment's read status
        /// </summary>
        /// <param name="commentId"></param>
        /// <param name="read"></param>
        /// <returns></returns>
        Task UpdateCommentMeasurements(int clientId, int fromClientId, bool read, DateTime date);
    }
}
