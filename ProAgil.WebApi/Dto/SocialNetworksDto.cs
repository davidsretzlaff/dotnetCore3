using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dto
{
    public class SocialNetworksDto
    {
        public int Id { get; set; }
        
        [Required (ErrorMessage="O Campo {0} é Obrigatório")]
        public string Name { get; set; }

        [Required (ErrorMessage="O Campo {0} é Obrigatório")]
        public string URL { get; set; }
    }
}