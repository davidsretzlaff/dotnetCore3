using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dto
{
    public class LotDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        [Range(2, 120000)]
        public int Quantity { get; set; }
    }
}