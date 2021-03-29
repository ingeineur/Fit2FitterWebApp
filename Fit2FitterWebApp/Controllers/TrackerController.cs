using System;
using System.IO;
using System.Web;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;
using Fit2Fitter.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Fit2FitterWebApp.Controllers
{
    [Route("api/[controller]")]
    public class TrackerController : Controller
    {
        private readonly ITrackerService trackerService;

        public TrackerController(ITrackerService trackerService)
        {
            this.trackerService = trackerService;
        }

        [HttpPost("meal/image")]
        public async Task<IActionResult> PutMealImage([FromBody, Required] string imageData)
        {
            try
            {
                string Pic_Path = "~/Images/t.jpg";
                using (FileStream fs = new FileStream(Pic_Path, FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        byte[] data = Convert.FromBase64String(imageData);
                        bw.Write(data);
                        bw.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                //ErrorSignal.FromCurrentContext().Raise(ex);
                throw;
            }

            return this.Ok(true);
        }

        // PUT api/<controller>/5
        [HttpPut("activity")]
        public async Task<IActionResult> Put([FromBody, Required]ActivityDto activity, [FromQuery, Required] string date)
        {
            activity.Created = DateTime.Parse(date);
            var result = await this.trackerService.AddActivity(activity).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("meal")]
        public async Task<IActionResult> Put([FromBody, Required]MealDto meal, [FromQuery, Required] string date)
        {
            meal.Created = DateTime.Parse(date);
            var result = await this.trackerService.AddMeal(meal).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("comment")]
        public async Task<IActionResult> Put([FromBody, Required]CommentDto comment, [FromQuery, Required] string date)
        {
            comment.Created = DateTime.Parse(date);
            var result = await this.trackerService.AddComment(comment).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("{commentId}/comment/update")]
        public async Task<IActionResult> Put(int commentId, [FromQuery, Required] bool read)
        {
            var result = await this.trackerService.UpdateComment(commentId, read).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("{clientId}/comment/meals/update")]
        public async Task<IActionResult> Put(int clientId, [FromQuery, Required] bool read, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.UpdateCommentMeals(clientId, read, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("{clientId}/{fromClientId}/comment/meals/update")]
        public async Task<IActionResult> PutWithToId(int clientId, int fromClientId, [FromQuery, Required] bool read, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.UpdateCommentMeals(clientId, fromClientId, read, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("{clientId}/comment/measurements/update")]
        public async Task<IActionResult> UpdateMeasurements(int clientId, [FromQuery, Required] bool read, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.UpdateCommentMeasurements(clientId, read, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("{clientId}/{fromClientId}/comment/measurements/update")]
        public async Task<IActionResult> PutWithToIdMeasurements(int clientId, int fromClientId, [FromQuery, Required] bool read, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.UpdateCommentMeasurements(clientId, fromClientId, read, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("macrosguide")]
        public async Task<IActionResult> Put([FromBody, Required]MacrosGuideDto guide, [FromQuery, Required] string date)
        {
            guide.Created = DateTime.Parse(date);
            var result = await this.trackerService.AddMacrosGuide(guide).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpPut("macrosguides")]
        public async Task<IActionResult> Put([FromBody, Required]IEnumerable<MacrosGuideDto> guides, [FromQuery, Required] string dateString)
        {
            var date = DateTime.Parse(dateString);
            foreach (var guide in guides)
            {
                guide.Created = date;
                await this.trackerService.AddMacrosGuide(guide).ConfigureAwait(false);
            }
            
            return this.Ok(true);
        }

        [HttpPut("macrosguides/update")]
        public async Task<IActionResult> Update([FromBody, Required]IEnumerable<MacrosGuideDto> guides, [FromQuery, Required] string dateString)
        {
            var date = DateTime.Parse(dateString);
            var result = await this.trackerService.UpdateMacroGuides(guides, date).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpGet("{clientId}/activity")]
        public async Task<IEnumerable<ActivityDto>> GetActivities(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetActivities(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/activity/slice")]
        public async Task<IEnumerable<ActivityDto>> GetActivitiesSlice (int clientId, [FromQuery, Required] string fromDate, [FromQuery, Required] string toDate)
        {
            var data = await this.trackerService.GetActivities(clientId, DateTime.Parse(fromDate), DateTime.Parse(toDate)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("activity")]
        public async Task<IEnumerable<ActivityDto>> GetActivities([FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetActivities(DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/meals")]
        public async Task<IEnumerable<MealDto>> GetMeals(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetMeals(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/all/comments")]
        public async Task<IEnumerable<CommentDto>> GetAllComments(int clientId, [FromQuery, Required] bool sent, [FromQuery, Required] int mealsRef)
        {
            var data = await this.trackerService.GetAllComments(clientId, sent, mealsRef).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/all/comments/meals")]
        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals(int clientId)
        {
            var data = await this.trackerService.GetAllCommentsMeals(clientId).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/status/comments/meals")]
        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals(int clientId, bool readStatus)
        {
            var data = await this.trackerService.GetAllCommentsMeals(clientId, readStatus).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("all/comments/meals")]
        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeals([FromQuery, Required] string dateString)
        {
            var data = await this.trackerService.GetAllCommentsMeals(DateTime.Parse(dateString)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/comments/meals")]
        public async Task<IEnumerable<CommentDto>> GetCommentsMeals(int clientId, string dateString)
        {
            var date = DateTime.Parse(dateString);
            var data = await this.trackerService.GetCommentsMeals(clientId, date).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("all/comments/measurements")]
        public async Task<IEnumerable<CommentDto>> GetAllCommentsMeasurements([FromQuery, Required] string dateString)
        {
            var data = await this.trackerService.GetAllCommentsMeasurements(DateTime.Parse(dateString)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/comments/measurements")]
        public async Task<IEnumerable<CommentDto>> GetCommentsMeasurements(int clientId, string dateString)
        {
            var date = DateTime.Parse(dateString);
            var data = await this.trackerService.GetCommentsMeasurements(clientId, date).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/status/comments/measurements")]
        public async Task<IEnumerable<CommentDto>> GetCommentsMeasurements(int clientId, [FromQuery, Required] string dateString, [FromQuery, Required] bool readStatus)
        {
            var date = DateTime.Parse(dateString);
            var data = await this.trackerService.GetCommentsMeasurements(clientId, date, readStatus).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/status/comments")]
        public async Task<IEnumerable<CommentDto>> GetComments(int clientId, [FromQuery, Required] bool readStatus)
        {
            var data = await this.trackerService.GetComments(clientId, readStatus).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/comments")]
        public async Task<IEnumerable<CommentDto>> GetComments(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetComments(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/macrosguide")]
        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetMacrosGuides(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/macrosguide/slice")]
        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuidesSlice (int clientId, [FromQuery, Required] string fromDate, 
            [FromQuery, Required] string toDate)
        {
            var data = await this.trackerService.GetMacrosGuides(clientId, DateTime.Parse(fromDate), DateTime.Parse(toDate)).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{clientId}/macrosguide/search")]
        public async Task<IEnumerable<MacrosGuideDto>> SearchMacrosGuides(int clientId, [FromQuery, Required] string keyword)
        {
            var data = await this.trackerService.GetMacrosGuides(clientId, keyword).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpDelete("{clientId}/meal/delete")]
        public async Task<IActionResult> deleteMeals(int clientId, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.DeleteMeals(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{clientId}/activity/all/delete")]
        public async Task<IActionResult> deleteAllActivities(int clientId, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.DeleteActivities(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{clientId}/activity/delete")]
        public async Task<IActionResult> deleteActivities(int clientId, [FromBody, Required] IEnumerable<int> activityIds)
        {
            var result = await this.trackerService.DeleteActivities(clientId, activityIds).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{commentId}/comment/delete")]
        public async Task<IActionResult> deleteComment(int commentId)
        {
            var result = await this.trackerService.DeleteComment(commentId).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{macrosGuideId}/macrosguide/delete")]
        public async Task<IActionResult> deleteMacrosGuide(int macrosGuideId)
        {
            var result = await this.trackerService.DeleteMacroGuide(macrosGuideId).ConfigureAwait(false);
            return this.Ok(result);
        }
    }
}
