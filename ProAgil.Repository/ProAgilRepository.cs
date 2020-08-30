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
        public void DeleteRange<T>(T[] entityArray) where T: class{
            _context.RemoveRange(entityArray);
        }
        public async Task<bool> SaveChangesAsync()
        {
            // se salvou retorna  true
            return (await _context.SaveChangesAsync()) > 0;
        }

        // EVENTS
        public async Task<Event> GetEventById(int EventId, bool includeSpeaker)
        {
           IQueryable<Event> query = _context.Events.Include(e => e.Lots).
            Include(e => e.SocialNetworks);

            if(includeSpeaker){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.SpeakerId);
            }

            //query = query.OrderByDescending(c => c.EventDate).Where(c => c.Id == EventId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<Event[]> GetAllEvents(bool includeSpeaker)
        {
            IQueryable<Event> query = _context.Events.Include(e => e.Lots).Include(e => e.SocialNetworks);
            
            if(includeSpeaker){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.Speaker);
            }

            return await query.ToArrayAsync();
        }
        public async Task<Event[]> GetEventsByTheme(string theme, bool includeSpeaker)
        {
            IQueryable<Event> query = _context.Events.Include(e => e.Lots).
            Include(e => e.SocialNetworks);

            if(includeSpeaker){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.SpeakerId);
            }

            return await query.OrderByDescending(e => e.Theme.ToLower().Contains(theme.ToLower())).ToArrayAsync();
        }       

        // SPEAKER
        public async Task<Speaker> GetSpeakerById(int speakerId, bool includeEvents)
        {
            IQueryable<Speaker> query = _context.Speakers.Include(e => e.SocialNetworks);

            if(includeEvents){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.Event);
            }
            return await query.Where(c => c.Id == speakerId).FirstOrDefaultAsync();
        }
        
        public async Task<Speaker[]> GetAllSpeaker(bool includeEvents)
        {
            IQueryable<Speaker> query = _context.Speakers.Include(e => e.SocialNetworks);

            if(includeEvents){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.Event);
            }
            return await query.ToArrayAsync();
        }

        public async Task<Speaker[]> GetSpeakerByName(string name, bool includeEvents)
        {
            IQueryable<Speaker> query = _context.Speakers.Include(e => e.SocialNetworks);

            if(includeEvents){
                query = query.Include(se => se.SpeakerEvents).ThenInclude(s => s.Event);
            }

            return await query.Where(c => c.Name.ToLower().Contains(name.ToLower())).ToArrayAsync();
        }
    }
}