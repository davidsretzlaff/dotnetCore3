import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(private http: HttpClient) { }

  _filterList: string;

  get filterList(){
    return this._filterList;
  }
  set filterList(value: string){
    this._filterList = value;
    this.eventFilter = this.filterList ? this.filterEvents(this.filterList) : this.events;
  }

  eventFilter: any = [];
  events: any = [];
  imageWidth = 28;
  imageMargin = 2;
  showImage = false;
  
  ngOnInit(){
    this.getEvent();
    this.filterEvents('');
  }

  filterEvents(filter : string) : any{
    filter = filter.toLocaleLowerCase();
    return this.events.filter(
      event => event.theme.toLocaleLowerCase().indexOf(filter) !== -1 ||
      event.place.toLocaleLowerCase().indexOf(filter) !== -1
    );
  }
  
  getEvent(){
    this.http.get('http://localhost:5000/api/event').subscribe(
      response => {
        this.events = response;
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
