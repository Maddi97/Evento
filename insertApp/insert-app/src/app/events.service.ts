import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { filter, map, catchError, share } from 'rxjs/operators';
import { Event } from './models/event';

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
          (response: Event) => {
          }
        )
        return obs;
     }
}
