using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) :  base (options){}
        public DbSet<Event> Events{get;set;}
        public DbSet<SocialNetworks> SocialNetworks{get;set;}
        public DbSet<Lot> Lots{get;set;}
        public DbSet<Speaker> Speakers{get;set;}
        public DbSet<SpeakerEvent> SpeakerEvents{get;set;}
    }
}