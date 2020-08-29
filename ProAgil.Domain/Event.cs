using System;
using System.Collections.Generic;

namespace ProAgil.Domain
{
    public class Event
    {
        public int Id { get; set; }
        public string Place { get; set; }
        public DateTime EventDate { get; set; }
        public string Theme { get; set; }
        public int Quantity{get;set;}
        public string ImageURL { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public List<Lot> Lots{ get; set; }
        public List<SocialNetworks> SocialNetworks { get; set; }
        public List<SpeakerEvent> SpeakerEvents  { get; set; }        
        
    }
}