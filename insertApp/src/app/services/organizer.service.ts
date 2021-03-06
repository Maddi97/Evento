import {Injectable} from '@angular/core';
import {WebService} from './web.service';
import {Observable, throwError as observableThrowError, BehaviorSubject, Subject} from 'rxjs';
import {Organizer} from '../models/organizer';
import {HttpRequest} from '@angular/common/http';
import {filter, map, catchError, share} from 'rxjs/operators';

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


    createOrganizer(organizer: Organizer): Observable<Organizer> {
        const obs = this.webService.post('organizer', {organizer}).pipe(
            map((r: HttpRequest<any>) => r as unknown as Organizer),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
        obs.toPromise().then(
            (response: Organizer) => {
                const tempOrg = this._organizers.getValue();
                tempOrg.push(response);
                this._organizers.next(tempOrg);
            }
        )
        return obs;

    }

    updateOrganizer(id: string, organizer: Organizer) {
        const obs = this.webService.patch(`organizer/${id}`, {organizer}).pipe(
            map((r: HttpRequest<any>) => r as unknown as Organizer),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            share());

        obs.toPromise().then(
            (response: Organizer) => {
                const tempOrg = this._organizers.getValue();
                let indeX: number;
                tempOrg.map((o: Organizer, index) => {
                    if (o._id === id) {
                        indeX = index;
                    }
                });
                tempOrg[indeX] = organizer;
                this._organizers.next(tempOrg);
            }
        )
        return obs;
    }

    deleteOrganizer(id: string) {
        const obs = this.webService.delete(`organizer/${id}`).pipe(
            map((r: HttpRequest<any>) => r as unknown as Organizer),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
        obs.toPromise().then(
            (response: Organizer) => {
                const tempOrg = this._organizers.getValue();
                tempOrg.map((o: Organizer, index) => {
                    if (o._id === id) {
                        tempOrg.splice(index, 1);
                    }
                });
                this._organizers.next(tempOrg);
            }
        )
        return obs;
    }

}