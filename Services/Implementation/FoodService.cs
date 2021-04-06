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
    public class FoodService:IFoodService
    {
        private readonly IClientRepository clientRepository;
        private readonly IFoodRepository foodRepository;

        public FoodService(IClientRepository clientRepository, IFoodRepository foodRepository)
        {
            this.clientRepository = clientRepository;
            this.foodRepository = foodRepository;
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
            var results = await this.foodRepository.FindFoods(keyword).ConfigureAwait(false);
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
            var portions = await this.foodRepository.FindPortions(fdcId).ConfigureAwait(false);
            List<FoodPortionDto> dtos = new List<FoodPortionDto>();
            var carbs = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1005").ConfigureAwait(false));
            var protein = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1003").ConfigureAwait(false));
            var fat = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1004").ConfigureAwait(false));

            var sugar = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1063").ConfigureAwait(false));
            var sucrose = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1010").ConfigureAwait(false));
            var glucose = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1011").ConfigureAwait(false));
            var fruitose = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1012").ConfigureAwait(false));

            var fiber = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1079").ConfigureAwait(false));
            var water = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1051").ConfigureAwait(false));

            var vA = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1105").ConfigureAwait(false));
            var vB6 = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1175").ConfigureAwait(false));
            var vC = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1162").ConfigureAwait(false));
            var vD = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1110").ConfigureAwait(false));

            var calcium = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1087").ConfigureAwait(false));
            var iron = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1089").ConfigureAwait(false));
            var potassium = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1092").ConfigureAwait(false));
            var zinc = this.GetNutrientValue(await this.foodRepository.FindFoodNutrients(fdcId, "1095").ConfigureAwait(false));

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

        public async Task<IEnumerable<FoodLegacyItemDto>> GetAnzFoods(string keyword)
        {
            var results = await this.foodRepository.FindAnzFoods(keyword).ConfigureAwait(false);
            var results2 = results.Select(Value => new { Value, Index = Value.Name.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase) })
                   .Where(pair => pair.Index >= 0)
                   .OrderBy(pair => pair.Index)
                   .Select(pair => pair.Value);

            List<AnzFoodNutrient> temp = new List<AnzFoodNutrient>();
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

            return temp.Select(food => new FoodLegacyItemDto
            {
                FdcId = food.FoodKey,
                Description = food.Name
            });
        }

        public async Task<IEnumerable<FoodPortionDto>> GetAnzFoodPortions(string foodKey)
        {
            var portions = await this.foodRepository.FindAnzPortions(foodKey).ConfigureAwait(false);
            List<FoodPortionDto> dtos = new List<FoodPortionDto>();

            var food = await this.foodRepository.FindAnzFoodsByKey(foodKey).ConfigureAwait(false);

            if (food == null)
            {
                return dtos;
            }

            foreach (var portion in portions)
            {
                dtos.Add(new FoodPortionDto
                {
                    FdcId = food.FoodKey,
                    Amount = portion.Quantity,
                    Modifier = portion.Description,
                    GramWeight = portion.Weight,
                    CarbValue = food.Carbs / 100,
                    ProteinValue = food.Protein / 100,
                    FatValue = food.Fat / 100,
                    WaterValue = food.Moisture / 100,
                    SugarValue = food.Sugars / 100,
                    StarchValue = food.Starch / 100,
                    SaturatedFattyAcidsValue = food.SaturatedFattyAcids / 100
                });
            }

            dtos.Add(new FoodPortionDto
            {
                FdcId = food.FoodKey,
                Amount = 1,
                Modifier = "one gram",
                GramWeight = 1,
                CarbValue = food.Carbs / 100,
                ProteinValue = food.Protein / 100,
                FatValue = food.Fat / 100,
                WaterValue = food.Moisture / 100,
                SugarValue = food.Sugars / 100,
                StarchValue = food.Starch / 100,
                SaturatedFattyAcidsValue = food.SaturatedFattyAcids / 100
            });

            dtos.Add(new FoodPortionDto
            {
                FdcId = food.FoodKey,
                Amount = 1,
                Modifier = "hundred gram",
                GramWeight = 100.0,
                CarbValue = food.Carbs / 100,
                ProteinValue = food.Protein / 100,
                FatValue = food.Fat / 100,
                WaterValue = food.Moisture / 100,
                SugarValue = food.Sugars / 100,
                StarchValue = food.Starch / 100,
                SaturatedFattyAcidsValue = food.SaturatedFattyAcids / 100
            });

            return dtos;
        }

        public async Task<int> AddRecipe(RecipeDto recipe)
        {
            try
            {
                var recipeId = await this.foodRepository.AddUpdateRecipe(
                new Recipe
                {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Carbs = recipe.Carbs,
                    Protein = recipe.Protein,
                    Fat = recipe.Fat,
                    Serving = recipe.Serving,
                    Photo = recipe.Photo,
                    Updated = DateTime.Now,
                    Created = recipe.Id > 0 ? recipe.Created : DateTime.Now,
                    ClientId = recipe.ClientId
                }
                ).ConfigureAwait(false);

                return recipeId;
            }
            catch(Exception ex)
            {
                return 0;
            }
        }

        public async Task<bool> AddRecipeItems(IEnumerable<RecipeItemDto> recipeItems)
        {
            try
            {
                foreach (var item in recipeItems)
                {
                    await this.foodRepository.AddUpdateRecipeItem(
                        new RecipeItem { 
                            Id = item.Id,
                            Name = item.Name,
                            DataSource = item.DataSource,
                            ExternalId = item.ExternalId,
                            Weight = item.Weight,
                            Carbs = item.Carbs,
                            Protein = item.Protein,
                            Fat = item.Fat,
                            Updated = DateTime.Now,
                            Created = item.Id > 0 ? item.Created: DateTime.Now,
                            RecipeId = item.RecipeId
                        });
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IEnumerable<RecipeDto>> GetRecipes(int clientId, string keyword)
        {
            try
            {
                var results = await this.foodRepository.FindRecipes(clientId, keyword).ConfigureAwait(false);
                var results2 = results.Select(Value => new { Value, Index = Value.Name.IndexOf(keyword, StringComparison.InvariantCultureIgnoreCase) })
                   .Where(pair => pair.Index >= 0)
                   .OrderBy(pair => pair.Index)
                   .Select(pair => pair.Value);

                return results2.Select(recipe => new RecipeDto {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Carbs = recipe.Carbs,
                    Protein = recipe.Protein,
                    Fat = recipe.Fat,
                    Serving = recipe.Serving,
                    Photo = recipe.Photo,
                    Updated = recipe.Updated,
                    Created = recipe.Created,
                    ClientId = recipe.ClientId
                });
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IEnumerable<RecipeItemDto>> GetRecipeItems(int recipeId)
        {
            try
            {
                var results = await this.foodRepository.GetRecipeItems(recipeId).ConfigureAwait(false);
                return results.Select(item => new RecipeItemDto {
                    Id = item.Id,
                    Name = item.Name,
                    DataSource = item.DataSource,
                    ExternalId = item.ExternalId,
                    Weight = item.Weight,
                    Carbs = item.Carbs,
                    Protein = item.Protein,
                    Fat = item.Fat,
                    Updated = item.Created,
                    Created = item.Created,
                    RecipeId = item.RecipeId
                });
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> DeleteRecipe(int recipeId)
        {
            try
            {
                await this.foodRepository.DeleteRecipe(recipeId).ConfigureAwait(false);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
