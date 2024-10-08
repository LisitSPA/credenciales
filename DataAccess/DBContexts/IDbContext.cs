using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DBContexts
{
    public interface IComplaintDbContext
    {
        public DbSet<Segment> Areas { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Collaborator> Collaborators { get; set; }
        public DbSet<Leadership> leaderships { get; set; }
        public DbSet<User> People { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}