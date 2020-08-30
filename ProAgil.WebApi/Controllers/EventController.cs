using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebApi.Dto;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IProAgilRepository _repo;

        private readonly IMapper _mapper;

        public EventController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try{
                var events = await _repo.GetAllEvents(true);
                // match date to dto
                var result = _mapper.Map<EventDto[]>(events);
                return Ok(result);
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco dados falhou {ex.Message}");
            }            
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventDto eventDto)
        {
            try{
                // convert eventodto to evento
                var eventModel = _mapper.Map<Event>(eventDto);
                _repo.Add(eventModel);
            
                if(await _repo.SaveChangesAsync()){
                    // mapper reverse
                    return Created($"/api/event/{eventDto.Id}",_mapper.Map<EventDto>(eventModel));
                }
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco dados falhou {ex.Message}");
            }            

            return BadRequest();
        }
   
        [HttpDelete("{EventId}")]
        public async Task<IActionResult> Delete(int EventId)
        {
            try{
                var eventModel = await _repo.GetEventById(EventId,false);
                if(eventModel == null) return NotFound();

                _repo.Delete(eventModel);

                if(await _repo.SaveChangesAsync()){
                    return Ok();
                }
            }
            catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco dados falhou");
            }
            return BadRequest();
        }

        [HttpPut("{EventId}")]
        public async Task<IActionResult> Put(int eventId,EventDto eventDto)
        {
            try{
                var eventModel = await _repo.GetEventById(eventId,false);                
                if(eventModel == null) return NotFound();

                var idLots = new List<int>();
                var idSocialNetworks = new List<int>();
                
                eventModel.Lots.ForEach(i => idLots.Add(i.Id));
                eventModel.SocialNetworks.ForEach(i => idSocialNetworks.Add(i.Id));

                var lots = eventModel.Lots.Where(l => !idLots.Contains(l.Id)).ToArray();
                var socialNetworks = eventModel.SocialNetworks.Where(sn => !idSocialNetworks.Contains(sn.Id)).ToArray();

                if(lots.Length > 0) _repo.DeleteRange(lots);
                if(socialNetworks.Length > 0) _repo.DeleteRange(socialNetworks);
                // mapeia as diferenças no match
                _mapper.Map(eventDto, eventModel);
                
                _repo.Update(eventModel);

                if(await _repo.SaveChangesAsync()){
                    return Created($"/api/event/{eventModel.Id}",_mapper.Map<EventDto>(eventModel));
                }
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco dados falhou {ex.Message}");
            }            

            return BadRequest();
        }

    }
}