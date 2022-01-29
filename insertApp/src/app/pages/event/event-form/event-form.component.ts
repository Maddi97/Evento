import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Address, Organizer} from '../../../models/organizer';
import {FormControl} from '@angular/forms';
import {Category} from '../../../models/category';
import {Event} from '../../../models/event';
import * as moment from 'moment';
import {map, share} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';
import * as log from 'loglevel';
import {NominatimGeoService} from '../../../services/nominatim-geo.service';
import {OrganizerService} from '../../../services/organizer.service';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnChanges {

    @Input() eventIn: Event;
    @Input() organizersIn: Organizer[];

    @Output() updateEvent: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() addNewEvent: EventEmitter<Event> = new EventEmitter<Event>();

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

    date = new FormControl(new Date())
    category: Category;
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

    constructor(
        private fb: FormBuilder,
        private geoService: NominatimGeoService,
        private organizerService: OrganizerService,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        if (this.eventIn !== undefined) {
            this.setEventForm()
        }
    }

    emitAddNewEvent() {

        const organizer = this.organizersIn.find(org => org.name === this.organizerName.value)
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
                this.addNewEvent.emit(event)
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
                this.addNewEvent.emit(event)
            )
        }
        // geoData is observable
        organizer.lastUpdated = new Date()
        this.organizerService.updateOrganizer(organizer._id, organizer).subscribe()
        this.nullFormField();
    }


    emitUpdateEvent() {
        const organizer = this.organizersIn.find(org => org.name === this.organizerName.value);
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
                    this.updateEvent.emit(event)
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
                    this.updateEvent.emit(event)
                }
            )
        }

        // geoData is observable
        organizer.lastUpdated = new Date()
        this.organizerService.updateOrganizer(organizer._id, organizer).subscribe()
        this.nullFormField();
    }


    setEventForm(): void {
        // prepare dates
        this.updateEventId = this.eventIn._id

        const start = moment(this.eventIn.date.start).toDate()
        const end = moment(this.eventIn.date.end).toDate()
        const organizer = this.organizersIn.find(org => org._id === this.eventIn._organizerId)
        this.organizerName.setValue(organizer.name)
        this.updateOrganizerId = organizer._id
        this.eventForm.setValue({
            name: this.eventIn.name,
            city: this.eventIn.address.city,
            plz: this.eventIn.address.plz,
            street: this.eventIn.address.street + ' ' + this.eventIn.address.streetNumber,
            streetNumber: this.eventIn.address.streetNumber,
            country: this.eventIn.address.country,
            description: this.eventIn.description,
            link: this.eventIn.link,
            permanent: String(this.eventIn.permanent),
            price: this.eventIn.price,
            start,
            end,
            coord: this.eventIn.geoData.lat + ', ' + this.eventIn.geoData.lon,
        })
        this.category = this.eventIn.category

        this.times.start.setValue(this.eventIn.times.start)
        this.times.end.setValue(this.eventIn.times.end)
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

    setCategory(value) {
        this.category = value
    }

    checkDisabled() {
        return !(!this.eventForm.invalid && this.category !== undefined);
    }

}
