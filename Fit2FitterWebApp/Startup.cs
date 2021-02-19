using Fit2Fitter.Database.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.Net.Http.Headers;

namespace Fit2FitterWebApp
{
    public class Startup
    {
        /// <summary>
        /// The swagger version.
        /// </summary>
        private const string SwaggerVersion = "v2";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var t = this.Configuration.GetConnectionString("DB_Connection_String");
            services.AddDbContext<DatabaseContext>(
                options => options.UseSqlServer(this.Configuration.GetConnectionString("DB_Connection_String")), ServiceLifetime.Transient);

            this.AddFrameworkServices(services);
            
            services.AddCors();
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("Policy1", builder =>
            //    {
            //        builder.WithOrigins("https://localhost:3000")
            //        .WithMethods("POST", "GET", "PUT", "DELETE")
            //        .WithHeaders(HeaderNames.ContentType);
            //    });
            //});
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("Policy2", builder =>
            //    {
            //        builder.WithOrigins("https://idafit2fitter.com/")
            //        .WithMethods("POST", "GET", "PUT", "DELETE")
            //        .WithHeaders(HeaderNames.ContentType);
            //    });
            //});
            //this.AddSwaggerToServices(services);
        }

        private void AddFrameworkServices(IServiceCollection services)
        {
            //repository
            services.AddTransient<Fit2Fitter.Database.Contracts.IClientRepository, Fit2Fitter.Database.Data.ClientRepository>();
            services.AddTransient<Fit2Fitter.Database.Contracts.ITrackerRepository, Fit2Fitter.Database.Data.TrackerRepository>();

            //services
            services.AddTransient<Fit2Fitter.Services.Contracts.IClientService, Fit2Fitter.Services.Implementation.ClientService>();
            services.AddTransient<Fit2Fitter.Services.Contracts.ITrackerService, Fit2Fitter.Services.Implementation.TrackerService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            //this.ConfigureSwaggerForApplication(app);
        }

        /// <summary>
        /// Configure swagger for application.
        /// </summary>
        /// <param name="app">The application builder.</param>
        private void ConfigureSwaggerForApplication(IApplicationBuilder app)
        {
            // Enable middle-ware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint($"./{SwaggerVersion}/swagger.json", "Fit2Fitter API"));
        }

        /// <summary>
        /// Add swagger to the services.
        /// </summary>
        /// <param name="services">The services.</param>
        private void AddSwaggerToServices(IServiceCollection services) =>
            services.AddSwaggerGen(c => c.SwaggerDoc(SwaggerVersion, new OpenApiInfo { Title = "AIMS Office Review API", Version = SwaggerVersion }));
    }
}
