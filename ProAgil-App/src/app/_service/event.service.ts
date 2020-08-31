import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from "../_models/Event";
@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseURL = 'http://localhost:5000/api/event';

  constructor(private http: HttpClient) { }

  getAllEvent(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseURL);
  }

  getEventByTheme(theme: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseURL}/getByTheme/${theme}`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseURL}/${id}`);
  }

  postEvent(event: Event){
    return this.http.post<Event>(this.baseURL, event);
  }

  putEvent(event: Event){
    return this.http.put<Event>(`${this.baseURL}/${event.id}`, event);
  }

  deleteEvent(id: number){
    return this.http.delete<Event>(`${this.baseURL}/${id}`);
  }
}
