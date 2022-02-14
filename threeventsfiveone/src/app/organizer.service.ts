import {Injectable} from '@angular/core';
import {WebService} from './web.service';
import {Observable, throwError as observableThrowError, BehaviorSubject, Subject} from 'rxjs';
import {HttpRequest} from '@angular/common/http';
import {filter, map, catchError, share} from 'rxjs/operators';
import {Organizer} from './models/organizer';

@Injectable({
  providedIn: 'root'
})

export class OrganizerService {

  private _organizers: BehaviorSubject<Organizer[]> = new BehaviorSubject(new Array<Organizer>());

  constructor(private webService: WebService) {
  }

  get organizers(): Observable<Organizer[]> {
    return this._organizers;
  }

  getOrganizer(): Observable<Organizer[]> {
    const obs = this.webService.get('organizer').pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      this._organizers.next(response);
    })
    return obs;
  }

  getOrganizerById(organizerId: string): Observable<Organizer[]> {
    const obs = this.webService.get(`organizer/${organizerId}`).pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      this._organizers.next(response);
    });
    return obs;
  }

  filterOrganizerByEventsCategory(category: any): Observable<Organizer[]> {
    const obs = this.webService.post('organizerByEventCategory', {category}).pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((response) => {
      this._organizers.next(response);
    })
    return obs;
  }

}
