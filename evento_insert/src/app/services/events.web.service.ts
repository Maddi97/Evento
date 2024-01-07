import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, throwError as observableThrowError, of } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';
import { Category } from '../models/category';
import { Event } from '../models/event';
import { WebService } from './web.service';


@Injectable({
    providedIn: 'root'
})
export class EventsService {

    private _events: BehaviorSubject<Event[]> = new BehaviorSubject(new Array<Event>());

    constructor(
        private webService: WebService,
    ) {
    }

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
                const tempEvent = this._events.getValue();
                tempEvent.push(response);
                this._events.next(tempEvent);
            }
        )
        return obs;
    }

    updateEvent(organizerId: string, eventId: string, event: Event) {

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
                tempEvent.map((eventResponse: Event, index) => {
                    if (eventResponse._id === eventId) {
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

    getEventsOnDateCategoryAndSubcategory(fil: any): Observable<Event[]> {
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
        })
        return obs;
    }

    getAllUpcomingEvents(): Observable<Event[]> {
        const date = moment(new Date()).utcOffset(0, false).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        const obs = this.webService.post('upcomingEvents', { date }).pipe(
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

    getActualEventsOnCategory(category: Category): Observable<Event[]> {
        const obs = this.webService.post('getActualEventsOnCategory', { category }).pipe(
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

    getEventsOnDate(date: moment.Moment, time: any): Observable<Event[]> {
        const obs = this.webService.post('eventOnDate', { date, time }).pipe(
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
    getOutdatedEvents(): Observable<Event[]> {
        const obs = this.webService.post('outdatedEvents', {}).pipe(
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

    checkIfEventsExistsInDB(event: Event): Observable<Event[]> {
        return this.webService.post('checkIfEventExists', { event }).pipe(
            map((res: any) => res as Event[]), // Adjust the type if needed
            catchError((error: any) => {
                console.error('An error occurred', error);
                return observableThrowError(error.error.message || error);
            })
        );
    }

    deletEvent(organizerId: string, id) {
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

    deleteOutdatedEvents() {
        return this.webService.post('deleteOutdatedEvents', {}).pipe(
            map(response => {
                return response;
            }),
            catchError(error => {
                // Handle the error here, log it, etc.
                console.error('Error deleting outdated events:', error);
                // Return false to indicate that an error occurred
                return of({ outdatedEvents: false });
            })
        );
    }
}
