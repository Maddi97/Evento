import {Component, OnInit, OnDestroy} from '@angular/core';
import {OrganizerService} from 'src/app/services/organizer.service';
import {Organizer} from 'src/app/models/organizer';
import {FormBuilder} from '@angular/forms';
import {Category} from 'src/app/models/category';
import {MatSnackBar} from '@angular/material/snack-bar'
import {NominatimGeoService} from '../../../services/nominatim-geo.service'
import {map} from 'rxjs/operators';
import {EventsService} from '../../../services/events.service';
import * as log from 'loglevel';

import {
    createEventFromOrg
} from './organizer.helpers'

@Component({
    selector: 'app-organizer-view',
    templateUrl: './organizer-view.component.html',
    styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit, OnDestroy {

    organizers: Organizer[] = [];
    updateOrganizerId = '';
    ifEventId = '';
    isOpeningTimesRequired = false;
    category: Category;

    // subscriptions
    organizer$;
    createOrganizer$;
    updateOrganizer$;
    deleteOrganizer$;

    // organizer for form
    organizerInformation: Organizer;
    disabled = false;

    constructor(
        private organizerService: OrganizerService,
        private fb: FormBuilder,
        private _snackbar: MatSnackBar,
        private geoService: NominatimGeoService,
        private eventService: EventsService,
    ) {
    }

    ngOnInit(): void {
        this.organizer$ = this.organizerService.organizers.pipe(
            map(o => {
                    this.organizers = o;
                }
            )
        );
        this.organizer$.subscribe()
    }

    ngOnDestroy(): void {
        this.organizer$.unsubscribe();
    }

    addNewOrganizer(organizer): void {
        // create organizerObject From FormField organizerForm
        const org = organizer
        const address = org.address

        // first fetch geo data from osm API and than complete event data type and send to backend
        this.createOrganizer$ = this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
            .pipe(
                map(
                    geoData => {
                        org.geoData.lat = geoData[0].lat;
                        org.geoData.lon = geoData[0].lon;

                        this.organizerService.createOrganizer(org)
                            .toPromise().then(
                            res => {
                                const _id = res._id;
                                if (res.isEvent === true) {
                                    // if org is event than create also an event object
                                    const event = createEventFromOrg(org)
                                    event._organizerId = _id
                                    this.eventService.createEvent(event).subscribe(
                                        (eventResponse) => {
                                            org.ifEventId = eventResponse._id
                                            this.organizerService.updateOrganizer(_id, org).subscribe(
                                            )
                                        }
                                    )
                                }
                                this.openSnackBar('Successfully added: ' + res.name)
                            })
                    }
                )).subscribe()
    }

    updateOrganizer(organizer): void {
        const org = organizer
        const address = org.address;
        org._id = organizer._id;
        org.ifEventId = this.ifEventId

        // first fetch geo data from osm API and than complete event data type and send to backend
        this.updateOrganizer$ = this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
            .pipe(
                map(
                    geoData => {
                        org.geoData.lat = geoData[0].lat;
                        org.geoData.lon = geoData[0].lon;
                        this.organizerService.updateOrganizer(org._id, org)
                            .toPromise().then(res => {
                                console.log(res)
                                const _id = res._id;
                                if (org.isEvent.toString() === 'true' && res.isEvent === false) {
                                    // if org is event than create also an event object
                                    const event = createEventFromOrg(org)
                                    event._organizerId = _id
                                    this.eventService.createEvent(event).subscribe(
                                        eventResponse => {
                                            org.ifEventId = eventResponse._id
                                            this.organizerService.updateOrganizer(org._id, org).subscribe(
                                            )
                                        }
                                    )
                                }

                                if (org.isEvent.toString() === 'false' && res.isEvent === true) {
                                    // TODO somehow find event id (id here is not correct)
                                    this.eventService.deletEvent(org._id, _id).subscribe(
                                    )
                                }
                                this.openSnackBar('Successfully updated: ' + res.name)
                            }
                        )
                    }
                ),
            ).subscribe()

        // this.updateOrganizer$.subscribe()

    }

    deleteOrganizer(id: string): void {
        this.deleteOrganizer$ = this.organizerService.deleteOrganizer(id)
        this.deleteOrganizer$.subscribe();
    }

    openSnackBar(message) {
        this._snackbar.open(message, '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['green-snackbar']

        });
    }


}
