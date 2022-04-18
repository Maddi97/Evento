import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OrganizerService} from 'src/app/services/organizer.service';
import {Address, Organizer} from 'src/app/models/organizer';
import {catchError, map, share} from 'rxjs/operators';
import {EventsService} from 'src/app/services/events.service';
import {Event} from '../../../models/event';
import {Category} from 'src/app/models/category';
import {CategoryService} from 'src/app/services/category.service';
import {NominatimGeoService} from '../../../services/nominatim-geo.service'
import {Observable} from 'rxjs';
import * as log from 'loglevel';
import * as moment from 'moment';
import {FileUploadService} from '../../../services/file-upload.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-event-view',
    templateUrl: './event-view.component.html',
    styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {


    eventIn: Event;

    categories: Category[]
    organizers: Organizer[] = [];
    allOrganizers: Organizer[] = [];


    filteredOptions: Observable<string[]>;
    allFilteredEvents: Event[];

    category$: Observable<Category[]>
    organizer$: Observable<Organizer[]>
    event$: Observable<Event[]>

    eventImagePath = 'images/eventImages/';

    constructor(
        private categoryService: CategoryService,
        private organizerService: OrganizerService,
        private eventService: EventsService,
        private fileService: FileUploadService,
        private sanitizer: DomSanitizer,
        private _snackbar: MatSnackBar,
    ) {
    }

    ngOnInit(): void {
        this.category$ = this.categoryService.categories
        this.organizer$ = this.organizerService.organizers
        this.event$ = this.eventService.event

        this.eventService.getEventsOnDate(moment(new Date()).utcOffset(0, false).set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        })).subscribe()

        this.category$.subscribe(cat => this.categories = cat);
        this.organizer$.subscribe(org => this.organizers = org);
        this.event$.subscribe(event => {
            this.allFilteredEvents = event
            this.downloadImage()
        });
        this.organizerService.getOrganizer().subscribe(org => {
            this.allOrganizers = org
        })

    }

    addNewEvent(event) {
        // set _id undefined otherwise error occurs
        event._id = undefined
        this.eventService.createEvent(event).pipe(
            map(createEventResponse => {
                // upload image
                event._id = createEventResponse._id
                const formdata = event.fd
                // fd only for passing formdata form input
                delete event.fd
                if (formdata !== undefined) {
                    const fullEventImagePath = this.eventImagePath + createEventResponse._id
                    formdata.append('eventImagePath', fullEventImagePath)
                    this.fileService.uploadEventImage(formdata).pipe(
                        map(uploadImageResponse => {
                            event.eventImagePath = uploadImageResponse.eventImage.path
                            this.eventService.updateEvent(event._organizerId, event._id, event)
                        })).subscribe()
                }
                this.openSnackBar('Successfully added Event: ' + event.name, 'success')
            }),
        ).subscribe()
    }

    updateEvent(event) {
        this.eventService.updateEvent(event._organizerId, event._id, event).pipe(
            map(createEventResponse => {
                // upload image
                const formdata = event.fd
                delete event.fd
                if (formdata !== undefined) {
                    const fullEventImagePath = this.eventImagePath + event._id
                    formdata.append('eventImagePath', fullEventImagePath)
                    this.fileService.uploadEventImage(formdata).pipe(
                        map(uploadImageResponse => {
                            event.eventImagePath = uploadImageResponse.eventImage.path
                            this.eventService.updateEvent(event._organizerId, event._id, event)

                        })).subscribe()
                }
                this.openSnackBar('Successfully updated Event: ' + event.name, 'success')
            })
        ).subscribe()
    }


    loadOrganizerOnSubcategories(category
                                     :
                                     Category
    ) {
        this.organizerService.filterOrganizerByEventsCategory(category)
        console.log(this.organizers)
    }

    loadEvents(organizerId
                   :
                   string, categoryId
                   :
                   string
    ) {

        this.eventService.getAllUpcomingEvents().pipe(
            map(
                events => {
                    this.allFilteredEvents = events.filter(event => event._organizerId === organizerId && event.category._id === categoryId)
                }
            )
        );
    }

    getHotEvents() {
        const date = moment(new Date()).utcOffset(0, false).set({hour: 0, minute: 0, second: 0, millisecond: 0})
        this.eventService.getEventsOnDate(date)
    }

    deleteEvent(organizerId
                    :
                    string, eventId
                    :
                    string
    ) {
        this.eventService.deletEvent(organizerId, eventId).subscribe()

    }


    timeSince(date) {

        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        let interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + ' years';
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + ' months';
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + ' days';
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + ' hours';
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + ' minutes';
        }
        return Math.floor(seconds) + ' seconds';
    }

    timeSinceInteger(date) {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        return seconds / 86400;
    }

    getColor(organizer
                 :
                 Organizer
    ):
        string {

        if (organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <= 1) {
            return 'lightcoral'
        }
        if (1 < organizer.frequency - this.timeSinceInteger(organizer.lastUpdated)
            && organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <= 5) {
            return 'orange'
        }
        if (organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) > 5) {
            return 'lightgreen'
        }
    }

    loadEventsByCategory(category: Category
    ) {
        this.eventService.getEventsOnCategory(category)
    }

    openSnackBar(message, state) {
        this._snackbar.open(message, '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

        });
    }

    downloadImage() {
        this.allFilteredEvents.forEach(event => {
            let imageURL = null
            if (event.eventImagePath !== undefined) {
                if (event.eventImageTemporaryURL === undefined) {
                    this.fileService.downloadFile(event.eventImagePath).subscribe(imageData => {
                        // create temporary Url for the downloaded image and bypass security
                        const unsafeImg = URL.createObjectURL(imageData);
                        imageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                        event.eventImageTemporaryURL = imageURL
                    })
                }
            }
        })
    }


}
