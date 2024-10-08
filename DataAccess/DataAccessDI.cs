using Application.Common.Interfaces;
using DataAccess.DBContexts;
using DataAccess.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess
{
    public static class ComplaintDataAccessDi
    {
        public static IServiceCollection AddComplaintDataAccess(this IServiceCollection services, IConfiguration configuration)
        {
            
            services.AddDbContext<ComplaintDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetValue<string>("ConnectionString"));
            });
            
            services.AddScoped<IComplaintDbContext,ComplaintDbContext>();

            services.AddTransient<IRepository<Segment>, Repository<Segment>>();
            services.AddTransient<IRepository<Attachment>, Repository<Attachment>>();
            services.AddTransient<IRepository<Collaborator>, Repository<Collaborator>>();
            services.AddTransient<IRepository<Leadership>, Repository<Leadership>>();
            services.AddTransient<IRepository<User>, Repository<User>>();
          
            return services;
        }
    }
}