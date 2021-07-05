import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { filter, map, catchError, share } from 'rxjs/operators';
import { Event } from './models/event';
import {Category} from "./models/category";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private _events: BehaviorSubject<Event[]> = new BehaviorSubject(new Array<Event>());

  constructor(
    private webService: WebService,
    ) { }

    get event(): Observable<Event[]> {
      return this._events;
    }

    createEvent(event: Event): Observable<Event> {
      const obs = this.webService.post('organizer/' + event._organizerId + '/events', { event }).pipe(
        map((r: HttpRequest<any>) => r as unknown as Event),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then(
          ( response: Event) => {
            const tempEvent = this._events.getValue();
            tempEvent.push(response);
            this._events.next(tempEvent);
          }
        )
        return obs;
     }

     updateEvent(organizerId: string ,eventId: string, event : Event){

      const obs = this.webService.patch(`organizer/${organizerId}/events/${eventId}`, { event }).pipe(
        map((r: HttpRequest<any>) => r as unknown as Event),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
  
      obs.toPromise().then(
        (response: Event) => {
          const tempEvent = this._events.getValue();
          let indeX: number;
          tempEvent.map((event: Event, index) => {
            if (event._id === eventId) {
              indeX = index;
            }
          });
          tempEvent[indeX] = response;
          this._events.next(tempEvent);
        }
      )
      return obs;
  }

     getAllEvents(): Observable<Event[]> {
       const obs = this.webService.get('events').pipe(
         map((res: HttpRequest<any>) => res as unknown as Event[]),
         catchError((error: any) => {
           console.error('an error occured', error);
           return observableThrowError(error.error.message || error);
         }),
         share());
        obs.toPromise().then((response) => {
          this._events.next(response);
        })
        return obs;
     }

     getEvents(organizerId: string): Observable<Event[]> {
      const obs = this.webService.get(`organizer/${organizerId}/events`).pipe(
        map((r: HttpRequest<any>) => r as unknown as Event[]),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then((response) => {
          this._events.next(response);
        })
        return obs;
    }

    getAllUpcomingEvents(): Observable<Event[]> {
      const obs = this.webService.get('upcomingEvents').pipe(
        map((res: HttpRequest<any>) => res as unknown as Event[]),
        catchError((error: any) => {
          console.error('an error occured', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
       obs.toPromise().then((response) => {
         this._events.next(response);
       })
       return obs;
    }

    getEventsOnCategory(category: Category): Observable<Event[]>{
        const obs = this.webService.post('getEventsOnCategory', { category }).pipe(
            map((res: HttpRequest<any>) => res as unknown as Event[]),
            catchError((error: any) => {
                console.error('an error occured', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
        obs.toPromise().then((response) => {
            this._events.next(response);
        })
        return obs;
    }

    getEventsOnDate(date: Date): Observable<Event[]>{
        const obs = this.webService.post('eventOnDate', { date }).pipe(
            map((res: HttpRequest<any>) => res as unknown as Event[]),
            catchError((error: any) => {
                console.error('an error occured', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
        obs.toPromise().then((response) => {
            this._events.next(response);
        })
        return obs;
    }

    deletEvent(organizerId: string, id){
      const obs = this.webService.delete(`organizer/${organizerId}/events/${id}`).pipe(
        map((r: HttpRequest<any>) => r as unknown as Event),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then(
          (response: Event) => {
            const tempEvent = this._events.getValue();
            tempEvent.map((event: Event, index) => {
              if (event._id === id) {
                tempEvent.splice(index, 1);
              }
            });
            this._events.next(tempEvent);
          }
        )
        return obs;
    }
}
