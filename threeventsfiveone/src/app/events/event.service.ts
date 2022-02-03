import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { Event } from '../models/event';
import { WebService } from '../web.service';
import { filter, map, catchError, share, switchMap } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { Organizer } from '../models/organizer';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _events: BehaviorSubject<Event[]> = new BehaviorSubject(new Array<Event>());

  constructor(
    private webService: WebService,
  ) { }

  get events(): Observable<Event[]> {
    return this._events;
  }

  public eventForId(id: string): Event {
    return this._events.getValue().find(f => f._id === id);
  }


  getAllEvents() {
    const obs = this.webService.get('organizer').pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      const ids = response.map(o => {
        this.getEventForOrgId(o._id);
      }
    );
    });
  }

  getEventForOrgId(id: string) {
    const obs = this.webService.get('organizer/' + id + '/events').pipe(
      map((r: HttpRequest<any>) => r as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      const tempEv = this._events.getValue();
      response.map(res => {
        if (!tempEv.map(r => r._id).includes(res._id)) {
          tempEv.push(res);
        }
      });
      this._events.next(tempEv);
    });
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
    });
    return obs;
  }

  getEventsOnDate(date: moment.Moment): Observable<Event[]>{
    const obs = this.webService.post('eventOnDate', { date }).pipe(
      map((res: HttpRequest<any>) => res as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occured', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      this._events.next(response);
    });
    return obs;
  }

  getEventsOnDateCategoryAndSubcategory(fil: any): Observable<Event[]>{
    const obs = this.webService.post('eventOnDateCatAndSubcat', { fil }).pipe(
      map((res: HttpRequest<any>) =>
          res as unknown as Event[]),
      catchError((error: any) => {
        console.error('an error occured', error);
        return observableThrowError(error.error.message || error);
      }),
         share());
    obs.toPromise().then((response) => {
      this._events.next(response);
    });
    return obs;
  }
}
