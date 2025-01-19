using Api.Dependencies;
using Api.JwtConfig;
using Application;
using DataAccess;
using Proxy;
using Utility.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Linq;
using System.Reflection;
using System.Text;
using Api.Services;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                c.OperationFilter<SecurityRequirementsOperationFilter>();
                c.DocInclusionPredicate((docName, apiDesc) =>
                {
                    if (!apiDesc.TryGetMethodInfo(out MethodInfo methodInfo)) return false;
                    return !methodInfo.DeclaringType.AssemblyQualifiedName.StartsWith("DevExpress", StringComparison.OrdinalIgnoreCase);
                });
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
            });

            services.AddHttpContextAccessor();

            services.AddInfrastructure();
            services.AddComplaintDataAccess(Configuration);
            services.AddComplaintApplication();
            services.AddProxyRest();

            var secretKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(Configuration.GetSection("Jwt:Key").Value));
            JwtConfiguration.InitConfig(services, Configuration, secretKey);

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            services.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
            services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

            services.AddApplicationInsightsTelemetry();
            services.AddHealthChecks()
                .AddSqlServer(Configuration.GetValue<string>("ConnectionString"), name: "ComplaintDBConnection");
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Api v1"));
            
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("X-Frame-Options", "DENY"); 
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff"); 
                context.Response.Headers.Append("Referrer-Policy", "no-referrer"); 

                if (!env.IsDevelopment()) 
                {
                    context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                }

                await next();
            });

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    
    }
}