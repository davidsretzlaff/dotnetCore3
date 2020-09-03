using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
                Event[] eventModel = await _repo.GetAllEvents(true);
                // match date to dto
                EventDto[] result = _mapper.Map<EventDto[]>(eventModel);
                return Ok(result);
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco dados falhou {ex.Message}");
            }            
        }
        [HttpGet("{eventId}")]
        public async Task<IActionResult> Get(int eventId)
        {
            try{
                Event eventModel = await _repo.GetEventById(eventId,true);
                // match date to dto
                EventDto result = _mapper.Map<EventDto>(eventModel);
                return Ok(result);
            }
            catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco dados falhou {ex.Message}");
            }   
        }

        [HttpGet("getByTheme/{theme}")]
        public async Task<IActionResult> Get(string theme)
        {
            try{
                Event[] events = await _repo.GetEventsByTheme(theme,true);
                // match date to dto
                EventDto[] result = _mapper.Map<EventDto[]>(events);
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
                Event eventModel = _mapper.Map<Event>(eventDto);
                _repo.Add(eventModel);
            
                if(await _repo.SaveChangesAsync()){
                    // mapper reverse
                     var result = Created($"/api/event/{eventDto.Id}",_mapper.Map<EventDto>(eventModel));
                     eventModel.ImageURL = eventModel.Id.ToString() + eventModel.ImageURL;
                     _repo.Update(eventModel);
                     if(await _repo.SaveChangesAsync()){
                        return Created($"/api/event/{eventDto.Id}",eventModel);
                     }                     
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
                Event eventModel = await _repo.GetEventById(EventId,false);
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
                Event eventModel = await _repo.GetEventById(eventId,false);                
                if(eventModel == null) return NotFound();

                List<int> idLots = new List<int>();
                List<int> idSocialNetworks = new List<int>();
                
                eventModel.Lots.ForEach(i => idLots.Add(i.Id));
                eventModel.SocialNetworks.ForEach(i => idSocialNetworks.Add(i.Id));

                Lot[] lots = eventModel.Lots.Where(l => !idLots.Contains(l.Id)).ToArray();
                SocialNetworks[] socialNetworks = eventModel.SocialNetworks.Where(sn => !idSocialNetworks.Contains(sn.Id)).ToArray();

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

        [HttpPost("upload")]
        public async Task<IActionResult> Upload()
        {
            try{
                if(Request.Form != null && Request.Form.Files != null && Request.Form.Files[0] != null)
                {
                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine("Resources","Images");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(),folderName);
                    if(file.Length > 0){
                        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                        var fullPath = Path.Combine(pathToSave,fileName.Replace("\""," ").Trim());
                        
                        await using(var stream = new FileStream(fullPath, FileMode.Create)){
                            file.CopyTo(stream);                            
                            }
                    }
                    return Ok();
                }
                else{
                    return BadRequest($"Arquivo inválido");
                }
            }
            catch(System.Exception ex)
            {
                return BadRequest($"Erro ao tentar realizar upload: {ex.Message}");
            }            
        }
    }
}