using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;
using  ProAgil.Domain.Identity;

namespace ProAgil.Repository
{
    public class DataContext : IdentityDbContext<User, Role, int,
                                                 IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
                                                 IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) :  base (options){}
        public DbSet<Event> Events{get;set;}
        public DbSet<SocialNetworks> SocialNetworks{get;set;}
        public DbSet<Lot> Lots{get;set;}
        public DbSet<Speaker> Speakers{get;set;}
        public DbSet<SpeakerEvent> SpeakerEvents{get;set;}

        /// especificando n x n
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole => 
                {
                    userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                    userRole.HasOne(ur => ur.Role)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();
                    
                    userRole.HasOne(ur => ur.User)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();
                }
            );

            modelBuilder.Entity<SpeakerEvent>().HasKey(PE => new{PE.EventId,PE.SpeakerId});
        }
    }
}