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
        /// Finds client measurement.
        /// </summary>
        /// <param name="clientId">The user id.</param>
        /// <param name="date">recorded date.</param>
        /// <returns>The user that has the requirement user name.</returns>
        System.Threading.Tasks.Task<IEnumerable<Models.MacrosGuide>> FindMacroGuides(int clientId, DateTime date);

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
        /// Delete client activities by date
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task DeleteActivities(int clientId, DateTime date);
    }
}
