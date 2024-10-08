using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations
{
    public class CollaboratorConfig: IEntityTypeConfiguration<Collaborator>
    {
        public void Configure(EntityTypeBuilder<Collaborator> builder)
        {
            //Table Name
            builder.ToTable("Collaborators");
            
            //Primary Key
            builder.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .UseIdentityColumn();

            //Other Columns           
            builder.HasOne(x => x.Segment);
            builder.HasOne(x => x.Leadership);
            builder.HasMany(x => x.Attachments);
           

        }
    }
}