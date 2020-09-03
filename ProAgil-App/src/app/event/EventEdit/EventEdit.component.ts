import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Event } from 'src/app/_models/Event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/_service/event.service';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {Lot } from 'src/app/_models/Lot';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-EventEdit',
  templateUrl: './EventEdit.component.html',
  styleUrls: ['./EventEdit.component.css']
})
export class EventEditComponent implements OnInit {

  title = 'Editar Evento';
   event: Event = new Event();
   imageURL = 'assets/img/uploadimage.jpg';
   registerForm: FormGroup;
   file: File;
   fileNameToUpdate: string;

  dateNow = '';

  get lots(): FormArray {
    return <FormArray>this.registerForm.get('lots');
  }

  get socialNetworks(): FormArray {
    return <FormArray>this.registerForm.get('socialNetworks');
  }

  constructor(
    private eventService: EventService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private router: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

   ngOnInit() {
    this.validation();
    this.getEvent();
   }

  getEvent() {
    const idEvent = +this.router.snapshot.paramMap.get('id');
    this.eventService.getEventById(idEvent)
      .subscribe(
        (event: Event) => {
           var t2 = Object.assign({}, event);
           var t1 = {...event};
           console.log(t1);
           console.log(t2);
           //this.event = {...event};
          // this.fileNameToUpdate = event.imageURL.toString();

          // this.imageURL = `http://localhost:5000/resources/images/${this.event.imageURL}?_ts=${this.dateNow}`;

          // this.event.imageURL = '';
          // this.registerForm.patchValue(this.event);

          // this.event.lots.forEach(lot => {
          //   this.lots.push(this.createLot(lot));
          // });
          // this.event.socialNetworks.forEach(sn => {
          //   this.socialNetworks.push(this.createSocialNetworks(sn));
          // });
        }
      );
  }

  validation(){
    this.registerForm = this.fb.group({
      theme: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      place: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      quantity: ['', [Validators.required, Validators.max(12000)]],
      eventDate: ['', Validators.required],
      phone: ['', Validators.required],
      imageURL: [''],
      lots: this.fb.array([this.createLot()]),
      socialNetworks: this.fb.array([this.createSocialNetworks()])
    });
  }


  createLot(): FormGroup {
    return this.fb.group({
      name:  ['', Validators.required],
      quantity:  ['', Validators.required],
      price:  ['', Validators.required],
      startDate: [''],
      endDate: ['']
    });
  }

  createSocialNetworks(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  addLot() {
    //this.lots.push(this.createLot({ id: 0 }));
    this.lots.push(this.createLot());
  }

  addSocialNetworks() {
    //this.socialNetworks.push(this.createSocialNetworks({ id: 0 }));
    this.socialNetworks.push(this.createSocialNetworks());
  }

  removeLot(id: number) {
    this.lots.removeAt(id);
  }

  removeSocialNetworks(id: number) {
    this.socialNetworks.removeAt(id);
  }

  onFileChange(file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imageURL = event.target.result;

    //this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

  saveEvent() {
    this.event = Object.assign({ id: this.event.id }, this.registerForm.value);
    this.event.imageURL = this.fileNameToUpdate;

    this.uploadImagem();

    this.eventService.putEvent(this.event).subscribe(
      () => {
        this.toastr.success('Editado com Sucesso!');
      }, error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
      }
    );
  }

  uploadImagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
      //this.eventService.postUpload(this.file, this.fileNameToUpdate)
      this.eventService.postUpload(this.file)
        .subscribe(
          () => {
            this.dateNow = new Date().getMilliseconds().toString();
            this.imageURL = `http://localhost:5000/resources/images/${this.event.imageURL}?_ts=${this.dateNow}`;
          }
        );
    }
  }
}
