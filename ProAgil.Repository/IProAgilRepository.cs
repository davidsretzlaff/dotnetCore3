using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         //Dinamic Methods
        void Add<T> (T entity) where T: class;

        void Update<T> (T entity) where T: class;
        void Delete<T> (T entity) where T: class;

        void DeleteRange<T> (T[] entity) where T : class;
        Task<bool> SaveChangesAsync();

        //EVENT METHOD
        Task<Event[]> GetEventsByTheme(string theme, bool includeSpeaker);
        Task<Event[]> GetAllEvents( bool includeSpeaker);
        Task<Event> GetEventById(int EventId, bool includeSpeaker);

        //SPEAKER METHOD
        Task<Speaker[]> GetAllSpeaker(bool includeEvents);
        Task<Speaker[]> GetSpeakerByName(string name, bool includeEvents);
        Task<Speaker> GetSpeakerById(int speakerId,bool includeEvents);

    }
}