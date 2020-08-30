namespace ProAgil.Domain
{
    public class SpeakerEvent
    {
        public int SpeakerId { get; set; }
        public virtual Speaker Speaker { get; set; }
        public int EventId { get; set; }
        public virtual Event Event { get; set; }
    }
}