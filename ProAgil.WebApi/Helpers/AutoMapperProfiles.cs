using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProAgil.WebApi.Dto;

namespace ProAgil.WebApi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
         public AutoMapperProfiles()
        {
            ///Create map model to DTO
            
            //Get all speakers and sending
            CreateMap<Event,EventDto>()
            .ForMember(dest => dest.Speakers, opt =>{
                opt.MapFrom(font => font.SpeakerEvents.Select(x => x.Speaker).ToList());
            }).ReverseMap();

            CreateMap<Speaker, SpeakersDto>()
            .ForMember(dest => dest.Events, opt =>{
                opt.MapFrom(font => font.SpeakerEvents.Select(x => x.Event).ToList());
            }).ReverseMap();

            CreateMap<Lot,LotDto>().ReverseMap();
            CreateMap<SocialNetworks,SocialNetworksDto>().ReverseMap();
        }  
    }
}