import {Component, OnInit, OnDestroy} from '@angular/core';
import {OrganizerService} from 'src/app/services/organizer.service';
import {Organizer} from 'src/app/models/organizer';
import {FormBuilder} from '@angular/forms';
import {Category} from 'src/app/models/category';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar'
import {NominatimGeoService} from '../../../services/nominatim-geo.service'
import {catchError, map} from 'rxjs/operators';
import {EventsService} from '../../../services/events.service';
import * as log from 'loglevel';

import {
    createEventFromOrg, getOrganizerFormTemplate
} from './organizer.helpers'
import {FileUploadService} from "../../../services/file-upload.service";
import {DomSanitizer} from "@angular/platform-browser";
import {of, throwError} from "rxjs";

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

    organizerImagePath = 'images/organizerImages/';


    constructor(
        private organizerService: OrganizerService,
        private fb: FormBuilder,
        private _snackbar: MatSnackBar,
        private geoService: NominatimGeoService,
        private eventService: EventsService,
        private fileService: FileUploadService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
        this.organizer$ = this.organizerService.organizers.pipe(
            map(o => {
                    this.organizers = o;
                    this.downloadImage()

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
                        if (Object.keys(geoData).length < 1) {
                            throw new Error('No coordinates found to given address');
                        }
                        org.geoData.lat = geoData[0].lat;
                        org.geoData.lon = geoData[0].lon;

                        this.organizerService.createOrganizer(org)
                            .pipe(
                                map(
                                    createOrganizerResponse => {
                                        const _id = createOrganizerResponse._id;
                                        // upload image
                                        org._id = createOrganizerResponse._id
                                        const formdata = org.fd
                                        // fd only for passing formdata form input
                                        delete org.fd
                                        if (formdata !== undefined) {
                                            const fullEventImagePath = this.organizerImagePath + createOrganizerResponse._id
                                            formdata.append('organizerImagePath', fullEventImagePath)
                                            this.fileService.uploadOrganizerImage(formdata).subscribe(
                                                uploadImageResponse => {
                                                    org.organizerImagePath = uploadImageResponse.organizerImage.path
                                                    this.organizerService.updateOrganizer(_id, org).subscribe()
                                                })
                                        }

                                        if (createOrganizerResponse.isEvent === true) {
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
                                        this.openSnackBar('Successfully added: ' + createOrganizerResponse.name, 'success')
                                    }),
                            ).subscribe()
                    }
                ),
                catchError(err => {
                    this.openSnackBar('Error: ' + err, 'error')
                    throw err
                })).subscribe()
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
                        if (Object.keys(geoData).length < 1) {
                            throw new Error('No coordinates found to given address');
                        }
                        org.geoData.lat = geoData[0].lat;
                        org.geoData.lon = geoData[0].lon;
                        this.organizerService.updateOrganizer(org._id, org)
                            .pipe(
                                map(updateOrganizerResponse => {
                                    const _id = updateOrganizerResponse._id;

                                    const formdata = org.fd
                                    // fd only for passing formdata form input
                                    delete org.fd
                                    if (formdata !== undefined) {
                                        const fullEventImagePath = this.organizerImagePath + updateOrganizerResponse._id
                                        formdata.append('organizerImagePath', fullEventImagePath)
                                        this.fileService.uploadOrganizerImage(formdata).subscribe(
                                            uploadImageResponse => {
                                                org.organizerImagePath = uploadImageResponse.organizerImage.path
                                                this.organizerService.updateOrganizer(_id, org).subscribe()
                                            })
                                    }
                                    if (org.isEvent.toString() === 'true' && updateOrganizerResponse.isEvent === false) {
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

                                    if (org.isEvent.toString() === 'false' && updateOrganizerResponse.isEvent === true) {
                                        // TODO somehow find event id (id here is not correct)
                                        this.eventService.deletEvent(org._id, _id).subscribe(
                                        )
                                    }
                                    this.openSnackBar('Successfully updated: ' + updateOrganizerResponse.name, 'success')
                                })
                            ).subscribe()
                    }
                ),
                catchError(err => {
                    this.openSnackBar('Error: ' + err, 'error')
                    throw err
                })
            ).subscribe()

        // this.updateOrganizer$.subscribe()

    }

    deleteOrganizer(id: string): void {
        this.deleteOrganizer$ = this.organizerService.deleteOrganizer(id)
        this.deleteOrganizer$.subscribe();
    }

    downloadImage() {
        this.organizers.forEach(organizer => {
            let imageURL = null
            if (organizer.organizerImagePath !== undefined) {
                if (organizer.organizerImageTemporaryURL === undefined) {
                    this.fileService.downloadFile(organizer.organizerImagePath).subscribe(imageData => {
                        // create temporary Url for the downloaded image and bypass security
                        const unsafeImg = URL.createObjectURL(imageData);
                        imageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                        organizer.organizerImageTemporaryURL = imageURL
                    })
                }
            }
        })
    }

    openSnackBar(message, state) {
        this._snackbar.open(message, '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

        });
    }


}
