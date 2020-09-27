using System;
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

        [HttpPut("macrosguide")]
        public async Task<IActionResult> Put([FromQuery, Required]MacrosGuideDto guide)
        {
            var result = await this.trackerService.AddMacrosGuide(guide).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpGet("{clientId}/activity")]
        public async Task<IEnumerable<ActivityDto>> GetActivities(int clientId, [FromQuery, Required] string date)
        {
            var data = await this.trackerService.GetActivities(clientId, DateTime.Parse(date)).ConfigureAwait(false);
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
        public async Task<IEnumerable<CommentDto>> GetAllComments(int clientId, [FromQuery, Required] bool sent)
        {
            var data = await this.trackerService.GetAllComments(clientId, sent).ConfigureAwait(false);
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
        public async Task<IEnumerable<MacrosGuideDto>> GetMacrosGuides(int clientId, [FromQuery, Required] DateTime date)
        {
            var data = await this.trackerService.GetMacrosGuides(clientId, date).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpDelete("{clientId}/meal/delete")]
        public async Task<IActionResult> deleteMeals(int clientId, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.DeleteMeals(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{clientId}/activity/delete")]
        public async Task<IActionResult> deleteActivities(int clientId, [FromQuery, Required] string date)
        {
            var result = await this.trackerService.DeleteActivities(clientId, DateTime.Parse(date)).ConfigureAwait(false);
            return this.Ok(result);
        }

        [HttpDelete("{commentId}/comment/delete")]
        public async Task<IActionResult> deleteComment(int commentId)
        {
            var result = await this.trackerService.DeleteComment(commentId).ConfigureAwait(false);
            return this.Ok(result);
        }
    }
}
