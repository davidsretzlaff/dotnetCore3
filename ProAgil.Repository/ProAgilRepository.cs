using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly DataContext _context;
        public  ProAgilRepository(DataContext context){
            _context = context;
            // remove tracking to not lock resource in the entity framework
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
            // se salvou retorna  true
            return (await _context.SaveChangesAsync()) > 0;
        }

        // EVENTS
        public async Task<Event> GetEventById(int EventId, bool includeSpeaker)
        {
           IQueryable<Event> query = EventIncludeLotSocialNetworks(_context.Events);

            if(includeSpeaker){
                query = EventIncludeSpeaker(query);
            }

            query = query.OrderByDescending(c => c.EventDate).Where(c => c.Id == EventId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<Event[]> GetAllEvents(bool includeSpeaker)
        {
           IQueryable<Event> query = EventIncludeLotSocialNetworks(_context.Events);

            if(includeSpeaker){
                query = EventIncludeSpeaker(query);
            }

            return await query.ToArrayAsync();
        }
        public async Task<Event[]> GetEventsByTheme(string theme, bool includeSpeaker)
        {
            IQueryable<Event> query = EventIncludeLotSocialNetworks(_context.Events);

            if(includeSpeaker){
                query = EventIncludeSpeaker(query);
            }

            return await query.OrderByDescending(e => e.Theme.ToLower().Contains(theme.ToLower())).ToArrayAsync();
        }       

        // SPEAKER
        public async Task<Speaker> GetSpeakerById(int speakerId, bool includeEvents)
        {
            IQueryable<Speaker> query = SpeakerIncludeSocialNetworks(_context.Speakers);

            if(includeEvents){
                query = SpeakerIncludeEvent(query);
            }
            return await query.Where(c => c.Id == speakerId).FirstOrDefaultAsync();
        }
        
        public async Task<Speaker[]> GetAllSpeaker(bool includeEvents)
        {
            IQueryable<Speaker> query = SpeakerIncludeSocialNetworks(_context.Speakers);

            if(includeEvents){
                query = SpeakerIncludeEvent(query);
            }
            return await query.ToArrayAsync();
        }

        public async Task<Speaker[]> GetSpeakerByName(string name, bool includeEvents)
        {
            IQueryable<Speaker> query = SpeakerIncludeSocialNetworks(_context.Speakers);

            if(includeEvents){
                query = SpeakerIncludeEvent(query);
            }

            return await query.Where(c => c.Name.ToLower().Contains(name.ToLower())).ToArrayAsync();
        }

        // INCLUDES
        private IQueryable<Event> EventIncludeSpeaker(IQueryable<Event> query)
        {
            return query.Include(se => se.SpeakerEvents).ThenInclude(s => s.SpeakerId);
        }
        private IQueryable<Event> EventIncludeLotSocialNetworks(IQueryable<Event> query)
        {
            return 
            query.Include(e => e.Lots).
            Include(e => e.SocialNetworks);
        }
        private IQueryable<Speaker> SpeakerIncludeEvent(IQueryable<Speaker> query)
        {
            return query.Include(se => se.SpeakerEvents).ThenInclude(s => s.Event);
        }
        private IQueryable<Speaker> SpeakerIncludeSocialNetworks(IQueryable<Speaker> query)
        {
            return query.Include(e => e.SocialNetworks);
        }
    }
}