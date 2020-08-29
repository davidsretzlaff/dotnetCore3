using System.Collections.Generic;

namespace ProAgil.WebApi.Dto
{
    public class SpeakersDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Course { get; set; }
        public string ImageURL { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<SocialNetworksDto> SocialNetworks { get; set; }
        public List<EventDto> Events { get; set; }
    }
}