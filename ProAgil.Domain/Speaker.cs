using System.Collections.Generic;

namespace ProAgil.Domain
{
    public class Speaker
    {
        // public Speaker(){
        //     this.SpeakerEvents = new HashSet<SpeakerEvent>();
        // }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Curse { get; set; }
        public string ImageURL { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public List<SocialNetworks> SocialNetworks { get; set; }
        public List<SpeakerEvent> SpeakerEvents { get; set; }

    }
}