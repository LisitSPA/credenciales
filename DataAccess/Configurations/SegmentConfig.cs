using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations
{
    public class SegmentConfig : IEntityTypeConfiguration<Segment>
    {
        public void Configure(EntityTypeBuilder<Segment> builder)
        {
            //Table Name
            builder.ToTable("Segment");
            
            //Primary Key
            builder.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .UseIdentityColumn();

            //Other Columns

        }
    }
}