using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProAgil.WebApi.Dto;

namespace ProAgil.WebApi.Dto
{
    public class EventDto
    {
        public int Id { get; set; }

        [Required (ErrorMessage="Campo Obrigatório")]
        [StringLength (100, MinimumLength=3, ErrorMessage="Local é entre 3 e 100 Caracters")]
        public string Place { get; set; }
        public string EventDate { get; set; }

        [Required (ErrorMessage="O Tema deve ser Preeenchido")]
        public string Theme { get; set; }
        
        [Range(2, 120000, ErrorMessage="Quatidade de Pessoas é entre 2 e 120000")]
        public int Quantity { get; set; }
        public string ImageURL { get; set; }

        [Phone]
        public string Phone { get; set; }
        
        [EmailAddress(ErrorMessage="Email Inválido")]
        public string Email { get; set; }
        public List<LotDto> Lots { get; set; }
        public List<SocialNetworksDto> SocialNetworks { get; set; }
        public IList<SpeakersDto> Speakers { get; set; }
    }
}