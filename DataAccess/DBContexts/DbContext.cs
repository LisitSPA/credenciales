
using System.Reflection;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DBContexts
{
    public class ComplaintDbContext : AuditableContext, IComplaintDbContext
    {

        public ComplaintDbContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(builder);
        }

        public DbSet<Segment> Areas { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Collaborator> Collaborators { get; set; }
        public DbSet<Leadership> leaderships { get; set; }
        public DbSet<User> People { get; set; }


    }
}