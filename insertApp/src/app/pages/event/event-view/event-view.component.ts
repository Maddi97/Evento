import {Component, OnInit} from '@angular/core';
import {OrganizerService} from 'src/app/services/organizer.service';
import {Organizer, Address} from 'src/app/models/organizer';
import {FormBuilder, FormControl} from '@angular/forms';
import {startWith, map, share,} from 'rxjs/operators';
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

    updateOrganizerId = '';
    updateEventId = '';
    eventForm = this.fb.group({
        name: new FormControl('', []),
        city: new FormControl('Leipzig', []),
        plz: new FormControl('', []),
        street: new FormControl('', []),
        streetNumber: new FormControl('', []),
        country: new FormControl('Deutschland', []),
        description: new FormControl('', []),
        link: new FormControl('', []),
        price: new FormControl('', []),
        permanent: new FormControl('false', []),
        start: new FormControl('', []),
        end: new FormControl('', []),
        coord: new FormControl('', []),
    })
    categories: Category[]

    date = new FormControl(new Date())

    category: Category
    toggleIsChecked = new FormControl(true)

    times = {
        start: new FormControl('00:00'),
        end: new FormControl('00:00')
    }

    geoData = {
        lat: '',
        lon: ''
    }

    organizerName = new FormControl();
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
        private fb: FormBuilder,
        private geoService: NominatimGeoService,
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

        this.filteredOptions = this.organizerName.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );
    }

    private _filter(value: Organizer): string[] {
        const filterValue = value.name.toLowerCase();

        return this.organizers.map(o => o.name).filter(o => o.toLowerCase().includes(filterValue));
    }

    addNewEvent() {

        const organizer = this.organizers.find(org => org.name === this.organizerName.value)
        const event = new Event()
        const address = new Address()
        event._organizerId = organizer._id;
        event.organizerName = organizer.name;
        event.name = this.eventForm.get('name').value;
        address.plz = this.eventForm.get('plz').value;
        address.city = this.eventForm.get('city').value;

        const addressSplit = this.eventForm.get('street').value.split(' ')
        if (addressSplit[0] === '' && addressSplit.length === 2) {
            address.street = addressSplit[1]
            address.streetNumber = ''
        } else if (addressSplit.length === 1) {
            address.street = addressSplit[0]
            address.streetNumber = ''
        } else {
            address.street = addressSplit.slice(0, -1).join(' ');
            address.streetNumber = addressSplit.slice(-1)[0];
        }


        address.country = this.eventForm.get('country').value;

        event.address = address

        event.description = this.eventForm.get('description').value;
        event.link = this.eventForm.get('link').value;
        event.price = this.eventForm.get('price').value;
        event.permanent = this.eventForm.get('permanent').value;
        event.category = this.category;
        event.date = {
            start: moment(new Date()).utcOffset(0, true),
            end: moment(new Date()).utcOffset(0, true)
        }


        if (this.eventForm.get('permanent').value === 'false') {
            let start = this.eventForm.get('start').value
            start.setDate(start.getDate())
            start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
            event.date.start = start

            let end = this.eventForm.get('end').value
            end.setDate(end.getDate())
            end = moment(new Date(end.toISOString())).utcOffset(0, true).format();
            event.date.end = end
        } else {
            event.date.start = moment(new Date()).utcOffset(0, true)
            event.date.end = moment(new Date()).utcOffset(0, true)
        }

        event.times = {start: this.times.start.value, end: this.times.end.value}
        console.log(event.date)
        if (this.toggleIsChecked.value) {
            event.geoData = this.geoData
            // first fetch geo data from osm API and than complete event data type and send to backend
            this.geoService.get_geo_data(address.city, address.street, address.streetNumber).pipe(
                map(geoData => {

                    event.geoData.lat = geoData[0].lat;
                    event.geoData.lon = geoData[0].lon;
                }),
                share()
            ).toPromise().then(() =>
                this.eventService.createEvent(event).subscribe(eventResponse => log.debug(eventResponse.date))
            )
        } else {
            const coord = this.eventForm.get('coord').value
            this.geoData.lat = coord.split(',')[0].trim()
            this.geoData.lon = coord.split(',')[1].trim()
            event.geoData = this.geoData
            this.geoService.get_address_from_coordinates(this.geoData).pipe(
                map((geoJSON: any) => {
                    event.address.plz = geoJSON.address.postcode;
                    event.address.street = geoJSON.address.road;
                    // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
                    event.address.country = this.eventForm.get('country').value;
                }),
                share()
            ).toPromise().then(() =>
                this.eventService.createEvent(event).subscribe(eventResponse => log.debug('Created Event: ', eventResponse))
            )
        }

        // geoData is observable
        organizer.lastUpdated = new Date()
        this.organizerService.updateOrganizer(organizer._id, organizer).subscribe()
        this.nullFormField();
    }


    insertOrgInfo(org: Organizer) {
        this.eventForm.get('plz').setValue(org.address.plz);
        this.eventForm.get('city').setValue(org.address.city);
        this.eventForm.get('street').setValue(org.address.street + ' ' + org.address.streetNumber);
    }

    nullFormField() {
        this.updateEventId = ''
        this.organizerName.setValue('')
        this.eventForm.setValue({
            name: '',
            city: 'Dresden',
            plz: '',
            street: '',
            streetNumber: '',
            country: 'Deutschland',
            description: '',
            link: '',
            permanent: 'false',
            price: '',
            start: '',
            end: '',
            coord: '',
        })
        this.category = undefined
        this.times.start.setValue('00:00')
        this.times.end.setValue('00:00')
    }

    loadOrganizerOnSubcategories(category: Category) {
        this.organizerService.filterOrganizerByEventsCategory(category)
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


    setEventForm(event: Event): void {
        // prepare dates
        console.log(event)
        const start = moment(event.date.start).toDate()
        const end = moment(event.date.end).toDate()
        this.updateEventId = event._id
        const organizer = this.organizers.find(org => org._id === event._organizerId)
        this.organizerName.setValue(organizer.name)
        this.updateOrganizerId = organizer._id
        this.eventForm.setValue({
            name: event.name,
            city: event.address.city,
            plz: event.address.plz,
            street: event.address.street + ' ' + event.address.streetNumber,
            streetNumber: event.address.streetNumber,
            country: event.address.country,
            description: event.description,
            link: event.link,
            permanent: String(event.permanent),
            price: event.price,
            start,
            end,
            coord: event.geoData.lat + ', ' + event.geoData.lon,
        })
        this.category = event.category

        this.times.start.setValue(event.times.start)
        this.times.end.setValue(event.times.end)
    }


    updateEvent() {
        const organizer = this.organizers.find(org => org.name === this.organizerName.value);
        const event = new Event()
        const address = new Address()
        event._organizerId = organizer._id
        event.organizerName = organizer.name
        event.name = this.eventForm.get('name').value;
        address.plz = this.eventForm.get('plz').value;
        address.city = this.eventForm.get('city').value;
        const adressSplit = this.eventForm.get('street').value.split(' ')
        if (adressSplit[0] === '' && adressSplit.length === 2) {
            address.street = adressSplit[1]
            address.streetNumber = ''
        } else if (adressSplit.length === 1) {
            address.street = adressSplit[0]
            address.streetNumber = ''
        } else {
            address.street = adressSplit.slice(0, -1).join(' ');
            address.streetNumber = adressSplit.slice(-1)[0];
        }
        address.country = this.eventForm.get('country').value;

        event.address = address

        event.description = this.eventForm.get('description').value;
        event.link = this.eventForm.get('link').value;
        event.price = this.eventForm.get('price').value;
        event.permanent = this.eventForm.get('permanent').value;
        event.category = this.category;
        event.date = {start: moment(new Date()).utcOffset(0, true), end: moment(new Date()).utcOffset(0, true)}

        if (this.eventForm.get('permanent').value === 'false') {
            let start = this.eventForm.get('start').value
            start.setDate(start.getDate())

            start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
            event.date.start = start

            let end = this.eventForm.get('end').value
            end.setDate(end.getDate())
            end = moment(new Date(end.toISOString())).utcOffset(0, true).format();
            event.date.end = end
        } else {
            event.date.start = moment(new Date()).utcOffset(0, true)
            event.date.end = moment(new Date()).utcOffset(0, true)
        }

        event.times = {start: this.times.start.value, end: this.times.end.value}
        event._id = this.updateEventId

        if (this.toggleIsChecked.value) {
            event.geoData = this.geoData
            this.geoService.get_geo_data(address.city, address.street, address.streetNumber).pipe(
                map(geoData => {
                    event.geoData.lat = geoData[0].lat;
                    event.geoData.lon = geoData[0].lon;
                }),
                share()
            ).toPromise().then(() => {
                    this.eventService.updateEvent(event._organizerId, event._id, event).subscribe()
                    organizer.lastUpdated = new Date()
                    this.organizerService.updateOrganizer(organizer._id, organizer)
                }
            )
        } else {
            const coord = this.eventForm.get('coord').value
            this.geoData.lat = coord.split(',')[0].trim()
            this.geoData.lon = coord.split(',')[1].trim()
            event.geoData = this.geoData
            this.geoService.get_address_from_coordinates(this.geoData).pipe(
                map((geoJSON: any) => {
                    event.address.plz = geoJSON.address.postcode;
                    event.address.street = geoJSON.address.road;
                    // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
                    event.address.country = this.eventForm.get('country').value
                }),
                share()
            ).toPromise().then(() => {
                    this.eventService.updateEvent(event._organizerId, event._id, event).subscribe(eventResponse => log.debug(eventResponse))
                    organizer.lastUpdated = new Date()
                    this.organizerService.updateOrganizer(organizer._id, organizer)
                }
            )
        }


        this.nullFormField();
    }


    getHotEvents() {
        const date = moment(new Date()).utcOffset(0, false).set({hour: 0, minute: 0, second: 0, millisecond: 0})
        this.eventService.getEventsOnDate(date)
    }

    setCategory(value) {
        this.category = value
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

    checkDisabled() {
        return !(!this.eventForm.invalid && this.category !== undefined);
    }

    loadEventsByCategory(category: Category) {
        this.eventService.getEventsOnCategory(category)
    }

}

