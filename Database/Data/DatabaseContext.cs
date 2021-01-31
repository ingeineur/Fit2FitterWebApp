﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Fit2Fitter.Database.Data
{
    public class DatabaseContext:DbContext
    {
        /// <summary>
        /// Initialises a new instance of the <see cref="DatabaseContext"/> class.
        /// </summary>
        /// <param name="options">The database context options.</param>
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Gets or sets the clients.
        /// </summary>
        public virtual DbSet<Models.Client> Clients { get; set; }

        /// <summary>
        /// Gets or sets the Logins.
        /// </summary>
        public virtual DbSet<Models.Login> Logins { get; set; }

        /// <summary>
        /// Gets or sets the Logins.
        /// </summary>
        public virtual DbSet<Models.Daily> Dailies { get; set; }

        /// <summary>
        /// Gets or sets the Logins.
        /// </summary>
        public virtual DbSet<Models.Measurement> Measurements { get; set; }

        /// <summary>
        /// Gets or sets the activities.
        /// </summary>
        public virtual DbSet<Models.Activity> Activities { get; set; }

        /// <summary>
        /// Gets or sets the macro guides.
        /// </summary>
        public virtual DbSet<Models.MacrosGuide> MacrosGuides { get; set; }

        /// <summary>
        /// Gets or sets the macro plans.
        /// </summary>
        public virtual DbSet<Models.MacrosPlan> MacrosPlans { get; set; }

        /// <summary>
        /// Gets or sets the meal.
        /// </summary>
        public virtual DbSet<Models.Meal> Meals { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        public virtual DbSet<Models.Comment> Comments { get; set; }

        public virtual DbSet<Models.FoodLegacyItem> FoodLegacy { get; set; }
        public virtual DbSet<Models.FoodPortionLegacyItem> FoodPortionsLegacy { get; set; }
        public virtual DbSet<Models.FoodNutrientConversionFactor> FoodNutrientConversionFactor { get; set; }
        public virtual DbSet<Models.FoodCalorieConversionFactor> FoodCalorieConversionFactor { get; set; }
        public virtual DbSet<Models.FoodNutrient> FoodNutrients { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.Client>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Age)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Grp)
                    .HasMaxLength(50);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);
            });

            modelBuilder.Entity<Models.Login>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(e => e.LastLogin)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.Measurement>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Waist)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Hips)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Thigh)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Chest)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Weight)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.BodyFat)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.Daily>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Breakfast)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Lunch)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Dinner)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Snack)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.TCB)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.TDS)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.TW)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Macros)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.Activity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Calories)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Steps)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.MaxHr)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Duration)
                    .IsRequired()
                    .HasMaxLength(8);
            });

            modelBuilder.Entity<Models.MacrosGuide>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Food)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.MealType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Carb)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Protein)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Fat)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.FV)
                    .IsRequired()
                    .HasMaxLength(4);

              entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Photo)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Models.MacrosPlan>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Height)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Weight)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.MacroType)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ActivityLevel)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CarbPercent)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ProteinPercent)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.FatPercent)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Updated)
                      .IsRequired()
                      .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.Meal>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.MealType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.MacroType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.MealDesc)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.MacroValue)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.Comment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.MeasurementRef)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.MealsRef)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.ActivitiesRef)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.ReadStatus)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Updated)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.Created)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.FromId)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            modelBuilder.Entity<Models.FoodLegacyItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FdcId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.DataType)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.PublicationDate)
                    .IsRequired()
                    .HasMaxLength(8);
            });

            modelBuilder.Entity<Models.FoodPortionLegacyItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FoodPortionId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.FdcId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.SeqNum)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Amount)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.MeasureUnitId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.PortionDescription)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Modifier)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.GramWeight)
                    .IsRequired()
                    .HasMaxLength(8);
            });

            modelBuilder.Entity<Models.FoodNutrientConversionFactor>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FoodNutrientConversionFactorId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.FdcId)
                    .IsRequired()
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<Models.FoodCalorieConversionFactor>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FoodNutrientConversionFactorId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.ProteinValue)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.FatValue)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.CarbValue)
                    .IsRequired()
                    .HasMaxLength(8);
            });

            modelBuilder.Entity<Models.FoodNutrient>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FdcId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.NutrientId)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Amount)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.DataPoint)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.DerivationId)
                    .IsRequired()
                    .HasMaxLength(10);
            });
        }
    }
}
