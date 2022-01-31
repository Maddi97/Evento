import {Component, OnInit} from '@angular/core';
import {OrganizerService} from 'src/app/services/organizer.service';
import {Address, Organizer} from 'src/app/models/organizer';
import {map, share} from 'rxjs/operators';
import {EventsService} from 'src/app/services/events.service';
import {Event} from '../../../models/event';
import {Category} from 'src/app/models/category';
import {CategoryService} from 'src/app/services/category.service';
import {NominatimGeoService} from '../../../services/nominatim-geo.service'
import {Observable} from 'rxjs';
import * as log from 'loglevel';
import * as moment from 'moment';


@Component({
    selector: 'app-event-view',
    templateUrl: './event-view.component.html',
    styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

    eventIn: Event;

    categories: Category[]
    organizers: Organizer[] = [];

    filteredOptions: Observable<string[]>;
    allFilteredEvents: Event[];

    category$: Observable<Category[]>
    organizer$: Observable<Organizer[]>
    event$: Observable<Event[]>

    constructor(
        private categoryService: CategoryService,
        private organizerService: OrganizerService,
        private eventService: EventsService,
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
        this.event$.subscribe(event => this.allFilteredEvents = event);

    }

    addNewEvent(event) {
        // set _id undefined otherwise error occurs
        event._id = undefined
        this.eventService.createEvent(event).subscribe(eventResponse => log.debug(eventResponse.date))
    }

    updateEvent(event) {
        this.eventService.updateEvent(event._organizerId, event._id, event).subscribe()
    }


    loadOrganizerOnSubcategories(category: Category) {
        this.organizerService.filterOrganizerByEventsCategory(category)
        console.log(this.organizers)
    }

    loadEvents(organizerId: string, categoryId: string) {

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
        console.log(this.allFilteredEvents)
    }

    deleteEvent(organizerId: string, eventId: string) {
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

    getColor(organizer: Organizer): string {

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

    loadEventsByCategory(category: Category) {
        this.eventService.getEventsOnCategory(category)
    }

}

