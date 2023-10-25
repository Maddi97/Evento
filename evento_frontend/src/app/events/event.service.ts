import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { map, catchError, share } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { Event } from '../models/event';
import { Organizer } from '../models/organizer';
import * as moment from 'moment';
import { WebService } from '../web.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private cachedEvents: Map<string, Event[]> = new Map();

  constructor(private webService: WebService) { }

  get events(): Observable<Event[]> {
    return this.getAllEvents(); // Example, you can customize this based on your needs.
  }

  public eventForId(id: string): Observable<Event | undefined> {
    return this.getAllEvents().pipe(
      map(events => events.find(event => event._id === id))
    );
  }

  getEventById(id: string): Observable<Event> {
    return this.webService.get('events/' + id).pipe(
      map((r: HttpRequest<any>) => r as unknown as Event),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  getAllEvents(): Observable<Event[]> { //might be broken
    return this.webService.get('organizer').pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      map(response => response.map(o => this.getEventForOrgId(o._id))),// Flatten the array of events
      map(responses => {
        return responses.reduce((acc, current) => acc.concat(current), []);
      }), // Flatten the array of events
      share()
    );
  }

  getEventForOrgId(id: string): Observable<Event[]> {
    return this.webService.get('organizer/' + id + '/events').pipe(
      map((r: HttpRequest<any>) => r as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  getAllUpcomingEvents(): Observable<Event[]> {
    const date = new Date();
    const cacheKey = JSON.stringify(date);
    if (this.cachedEvents.has(cacheKey)) {
      return of(this.cachedEvents.get(cacheKey)!);
    }

    const obs = this.webService.get('upcomingEvents').pipe(
      map((res: HttpRequest<any>) => res as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );

    obs.subscribe(response => {
      this.cachedEvents.set(cacheKey, response);
    });

    return obs;
  }

  getEventsOnDate(date: moment.Moment): Observable<Event[]> {
    return this.webService.post('eventOnDate', { date }).pipe(
      map((res: HttpRequest<any>) => res as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  getEventsBySearchString(req: any): Observable<Event[]> {
    const cacheKey = JSON.stringify(req);
    if (this.cachedEvents.has(cacheKey)) {
      return of(this.cachedEvents.get(cacheKey)!);
    }
    return this.webService.post('getEventsBySearchString', { req }).pipe(
      map((response: any) => {
        this.cachedEvents.set(cacheKey, response);
        return response as Event[]; // Return the response array
      }),
      catchError((error: any) => {
        console.error('An error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  getEventsOnDateCategoryAndSubcategory(fil: any): Observable<Event[]> {
    const cacheKey = JSON.stringify(fil);
    if (this.cachedEvents.has(cacheKey)) {
      return of(this.cachedEvents.get(cacheKey)!);
    }

    return this.webService.post('eventOnDateCatAndSubcat', { fil }).pipe(
      map((response: any) => {
        this.cachedEvents.set(cacheKey, response);
        return response as Event[]; // Return the response array
      }),
      catchError((error: any) => {
        console.error('An error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  get cachedEventList(): Observable<Event[]> {
    return this.getAllEvents();
  }
}
