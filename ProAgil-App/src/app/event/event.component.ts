import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventService} from '../_service/event.service';
import { Event } from '../_models/Event';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventFilter: Event[];
  events: Event[];
  event: Event;
  imageWidth = 28;
  imageMargin = 2;
  showImage = false;
  _filterList = '';
  registerForm: FormGroup;
  saveMethod = 'postEvento';
  bodyDeleteEvent = '';
  constructor(
    private eventService: EventService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService : BsLocaleService
    ) { 
      this.localeService.use('pt-br');
    }

  get filterList(){
    return this._filterList;
  }
  set filterList(value: string){
    this._filterList = value;
    this.eventFilter = this.filterList ? this.filterEvents(this.filterList) : this.events;
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  ngOnInit(){
    this.validation();
    this.getEvent();
    this.filterEvents('');
  }

  filterEvents(filter : string): Event[]{
    if(!filter){
      return this.events;
    }
    filter = filter.toLocaleLowerCase();
    return this.events.filter(
      event => event.theme.toLocaleLowerCase().includes(filter) ||
      event.place.toLocaleLowerCase().includes(filter)
    );
  }

  newEvent(template: any) {
    this.saveMethod = 'postEvent';
    this.openModal(template);
  }
 
  editEvent(evento: Event, template: any) {
    this.saveMethod = 'putEvent';
    this.openModal(template);
    this.event = evento;
    this.registerForm.patchValue(evento);
  }
  
  deleteEvent(event: Event, template: any) {
    this.openModal(template);
    this.event = event;
    this.bodyDeleteEvent = `Tem certeza que deseja excluir o Evento: ${event.theme}, Código: ${event.id}`;
  }
  
  confirmeDelete(template: any) {
    this.eventService.deleteEvent(this.event.id).subscribe(
      () => {
          template.hide();
          this.getEvent();
        }, error => {
          console.log(error);
        }
    );
  }
  saveChange(template: any){
    if(this.registerForm.valid){
      if (this.registerForm.valid) {
        console.log('savemethod',this.saveMethod);

        this.event = Object.assign(this.event ? { id: this.event.id } : {}, this.registerForm.value)
        this.eventService[this.saveMethod](this.event).subscribe(
          () => {
            template.hide();
            this.getEvent();
          }, error => {
            console.log(error);
          }
        )
      }
    }
  }

  validation(){
    this.registerForm = this.fb.group({
      theme: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      place: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      quantity: ['', [Validators.required, Validators.max(12000)]],
      eventDate: ['', Validators.required],
      phone: ['', Validators.required],
      imageURL: ['', Validators.required]
    });
  }

  getEvent(){
    this.eventService.getAllEvent().subscribe(
      (_events: Event[]) => {
        this.events = _events;
        this.eventFilter = this.events;
      },
      error => {
        console.log(error);
      }
    );
  }
  switchImage(){
    this.showImage = !this.showImage;
  }
}
