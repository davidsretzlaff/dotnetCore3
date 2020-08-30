import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventService} from '../_service/event.service';
import { Event } from '../_models/Event';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventFilter: Event[];
  events: Event[];
  imageWidth = 28;
  imageMargin = 2;
  showImage = false;
  _filterList = '';
  modalRef: BsModalRef;
  registerForm: FormGroup;

  constructor(
    private eventService: EventService,
    private modalService: BsModalService,
    private fb: FormBuilder
    ) { }

  get filterList(){
    return this._filterList;
  }
  set filterList(value: string){
    this._filterList = value;
    this.eventFilter = this.filterList ? this.filterEvents(this.filterList) : this.events;
  }

  openModal(template: TemplateRef<any>){
      this.modalRef = this.modalService.show(template);
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
  
  saveChange(){    
  }

  validation(){
    this.registerForm = new FormGroup({
      theme: new FormControl('',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      place: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      quantity: new FormControl('', [Validators.required, Validators.max(12000)]),
      eventDate: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      imageURL: new FormControl('', Validators.required)
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
