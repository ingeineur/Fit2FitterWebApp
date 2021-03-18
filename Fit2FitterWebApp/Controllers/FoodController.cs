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
    public class FoodController : Controller
    {
        private readonly IFoodService foodService;

        public FoodController(IFoodService foodService)
        {
            this.foodService = foodService;
        }

        [HttpGet("{keyword}/foods")]
        public async Task<IEnumerable<FoodLegacyItemDto>> GetFoods(string keyword)
        {
            var data = await this.foodService.GetFoods(keyword).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{fdcId}/food/portions")]
        public async Task<IEnumerable<FoodPortionDto>> GetFoodPortions(string fdcId)
        {
            var data = await this.foodService.GetFoodPortions(fdcId).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{keyword}/anz/foods")]
        public async Task<IEnumerable<FoodLegacyItemDto>> GetAnzFoods(string keyword)
        {
            var data = await this.foodService.GetAnzFoods(keyword).ConfigureAwait(false);
            return data.ToArray();
        }

        [HttpGet("{foodKey}/anz/food/portions")]
        public async Task<IEnumerable<FoodPortionDto>> GetAnzFoodPortions(string foodKey)
        {
            var data = await this.foodService.GetAnzFoodPortions(foodKey).ConfigureAwait(false);
            return data.ToArray();
        }
    }
}
