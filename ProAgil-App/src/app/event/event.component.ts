import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventService} from '../_service/event.service';
import { Event } from '../_models/Event';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventDate: string;
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
  title = 'Eventos';
  file: File;

  constructor(
    private eventService: EventService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService : BsLocaleService,
    private toastr: ToastrService
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
    this.event.imageURL = '';
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
          this.toastr.success('Deletado com sucesso');
        }, error => {
          this.toastr.error('Erro ao tentar Deletar');
          console.log(error);
        }
    );
  }
  saveChange(template: any){
    let methodMessage = 'Editado';
    let methodMessageError = 'Editar';


    if (this.saveMethod.toLowerCase() === 'postevent'){
      methodMessage = 'Inserido';
      methodMessageError = 'Inserir';
    }
    if (this.registerForm.valid){
      if (this.registerForm.valid) {
        this.event = Object.assign(this.event ? { id: this.event.id } : {}, this.registerForm.value);
        const fileName = this.event.imageURL.split('\\', 3);

        if (this.file){
          this.eventService.postUpload(this.file).subscribe();
          this.event.imageURL = fileName[2];
        }

        this.eventService[this.saveMethod](this.event).subscribe(
          () => {
            template.hide();
            this.getEvent();

            this.toastr.success(`${methodMessage} com Sucesso`);
          }, error => {
            this.toastr.error(`Erro ao ${methodMessageError}: ${error.message}`);
          }
        );
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
        this.toastr.error(`Erro ao tentar carregar eventos`);
      }
    );
  }
  switchImage(){
    this.showImage = !this.showImage;
  }

  onFileChange(event){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length){
      this.file = event.target.files;
      console.log(this.file);
    }
  }
}
