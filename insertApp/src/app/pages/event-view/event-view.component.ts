import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Address} from 'src/app/models/organizer';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, map, share, catchError } from 'rxjs/operators';
import { EventsService } from 'src/app/events.service';
import { Event } from '../../models/event';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/category.service';
import { NominatimGeoService } from '../../nominatim-geo.service'
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import * as log from "loglevel";
import * as moment from 'moment';



@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  updateOrganizerId  = '';
  updateEventId = '';

  eventsFilteredByCategory: Event[];

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

  date =  new FormControl(new Date())

  category: Category
  toggleIsChecked = new FormControl(true)

  times = {
    start: new FormControl('00:00'),
    end: new FormControl('00:00')
  }

  geo_data = {
    lat: '',
    lon: ''
  }

  organizerName = new FormControl();
  organizers: Organizer[] = [];
  organizerOfCategory: Organizer[];

  filteredOptions: Observable<string[]>;
  allUpcomingEvents: Event[] = [];
  eventsOfOrganizer: Event[];
    constructor(
    private categoryService: CategoryService,
    private organizerService: OrganizerService,
    private eventService: EventsService,
    private fb: FormBuilder,
    private geoService: NominatimGeoService,

  ) { }


  ngOnInit(): void {
      console.log(moment(new Date()).utcOffset(0, true).format())
    this.categoryService.categories.subscribe(cat => this.categories = cat)
    this.organizerService.organizers.subscribe(org => this.organizers = org);
    this.eventService.event.subscribe(event => this.allUpcomingEvents = event);
    this.eventService.getAllUpcomingEvents().subscribe()
    this.eventService.getEventsOnDate(new Date()).subscribe()
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
    address.plz =  this.eventForm.get('plz').value;
    address.city =  this.eventForm.get('city').value;

    let address_splitted =  this.eventForm.get('street').value.split(' ')
    if (address_splitted[0]=="" && address_splitted.length == 2) {
      address.street = address_splitted[1]
      address.streetNumber = ""
    }
    else if(address_splitted.length==1){
      address.street = address_splitted[0]
      address.streetNumber = ""
    }
    else{
      address.street = address_splitted.slice(0,-1).join(' ');
      address.streetNumber =  address_splitted.slice(-1)[0];
    }



    address.country =  this.eventForm.get('country').value;

    event.address = address

    event.description = this.eventForm.get('description').value;
    event.link = this.eventForm.get('link').value;
    event.price = this.eventForm.get('price').value;
    event.permanent = this.eventForm.get('permanent').value;
    event.category = this.category;
    event.date = {start: new Date, end: new Date }



    if(this.eventForm.get('permanent').value === 'false') {
      let start = this.eventForm.get('start').value
      start.setDate(start.getDate() )
      start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
      event.date.start = start

      let end = this.eventForm.get('end').value
      end.setDate(end.getDate())
      end = moment(new Date(end.toISOString())).utcOffset(0, true).format();
      event.date.end = end
    }
    else{
      event.date.start = new Date()
      event.date.end = new Date()
    }

    console.log(event.date)
    const time = {start:this.times.start.value, end: this.times.end.value}
    event.times = time
    console.log(event.date)
    if(this.toggleIsChecked.value) {
      event.geo_data = this.geo_data
      // first fetch geo data from osm API and than complete event data type and send to backend
      this.geoService.get_geo_data(address.city, address.street, address.streetNumber).pipe(
          map(geo_data => {

            event.geo_data.lat = geo_data[0].lat;
            event.geo_data.lon = geo_data[0].lon;
          }),
          share()
      ).toPromise().then(undefined =>
          this.eventService.createEvent(event).subscribe(event_response => log.debug(event_response.date))
      )
    }
    else {
      let coord = this.eventForm.get('coord').value
      this.geo_data.lat = coord.split(",")[0].trim()
      this.geo_data.lon = coord.split(",")[1].trim()
      event.geo_data = this.geo_data
      this.geoService.get_address_from_coordinates(this.geo_data).pipe(
          map( (geo_json: any) =>
          {
            event.address.plz = geo_json.address.postcode;
            event.address.street = geo_json.address.road;
            event.address.country = this.eventForm.get('country').value // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
          }),
          share()
      ).toPromise().then(undefined =>
          this.eventService.createEvent(event).subscribe(event_response => log.debug(event_response))
      )
    }

    // geo_data is observable
    log.debug(event)
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

  loadOrganizer(categoryName: string){
    this.organizerService.organizers.subscribe(org => this.organizerOfCategory = org.filter(o => o.category.name === categoryName))
  }

  loadEvents(organizerId: string){

    this.eventService.getEventsOnDate(new Date()).subscribe( x=> console.log('on date',x))
    this.eventService.getAllUpcomingEvents().subscribe(event => log.debug(event));
    this.eventsOfOrganizer = this.allUpcomingEvents.filter(event => event._organizerId === organizerId)
  }


  setEventForm(event: Event) : void{
    log.debug(event)
    //prepare dates
    let start = new Date(event.date.start)
    start.setDate(start.getDate())
    start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
    let end = new Date(event.date.end)
    end.setDate(end.getDate())
    end = moment(new Date(end.toISOString())).utcOffset(0, true).format();

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
      start: start,
      end: end,
      coord: event.geo_data.lat + ', ' + event.geo_data.lon,
    })
    this.category = event.category

    this.times.start.setValue(event.times.start)
    this.times.end.setValue(event.times.end)
  }


    updateEvent(){
    const organizer = this.organizers.find(org => org.name === this.organizerName.value);
    const event = new Event()
    const address = new Address()
    event._organizerId = organizer._id
    event.organizerName = organizer.name
    event.name = this.eventForm.get('name').value;
    address.plz =  this.eventForm.get('plz').value;
    address.city =  this.eventForm.get('city').value;
      let address_splitted =  this.eventForm.get('street').value.split(' ')
      if (address_splitted[0]=="" && address_splitted.length == 2) {
        address.street = address_splitted[1]
        address.streetNumber = ""
      }
      else if(address_splitted.length==1){
        address.street = address_splitted[0]
        address.streetNumber = ""
      }
      else{
        address.street = address_splitted.slice(0,-1).join(' ');
        address.streetNumber =  address_splitted.slice(-1)[0];
      }
    address.country =  this.eventForm.get('country').value;

    event.address = address

    event.description = this.eventForm.get('description').value;
    event.link = this.eventForm.get('link').value;
    event.price = this.eventForm.get('price').value;
    event.permanent = this.eventForm.get('permanent').value;
    event.category = this.category;
    event.date = {start: new Date, end: new Date }

      if(this.eventForm.get('permanent').value === 'false') {
        let start = this.eventForm.get('start').value
        start.setDate(start.getDate())

        start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
        event.date.start = start

        let end = this.eventForm.get('end').value
        end.setDate(end.getDate())
        end = moment(new Date(end.toISOString())).utcOffset(0, true).format();
        event.date.end = end
      }
      else{
        event.date.start = new Date()
        event.date.end = new Date()
      }

    const time = {start:this.times.start.value, end: this.times.end.value}
    event.times = time
    event._id = this.updateEventId

      if(this.toggleIsChecked.value) {
        event.geo_data = this.geo_data
        this.geoService.get_geo_data(address.city, address.street, address.streetNumber).pipe(
            map(geo_data => {
              event.geo_data.lat = geo_data[0].lat;
              event.geo_data.lon = geo_data[0].lon;
            }),
            share()
        ).toPromise().then(moin => {
              this.eventService.updateEvent(event._organizerId, event._id, event).subscribe(event => log.debug(event))
              organizer.lastUpdated = new Date()
              this.organizerService.updateOrganizer(organizer._id, organizer)
            }
        )
      }
      else{
        let coord = this.eventForm.get('coord').value
        this.geo_data.lat = coord.split(",")[0].trim()
        this.geo_data.lon = coord.split(",")[1].trim()
        event.geo_data = this.geo_data
        this.geoService.get_address_from_coordinates(this.geo_data).pipe(
            map( (geo_json: any) =>
            {
              event.address.plz = geo_json.address.postcode;
              event.address.street = geo_json.address.road;
              event.address.country = this.eventForm.get('country').value // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
            }),
            share()
        ).toPromise().then(undefined => {
              this.eventService.updateEvent(event._organizerId, event._id, event).subscribe(event_response => log.debug(event_response))
              organizer.lastUpdated = new Date()
              this.organizerService.updateOrganizer(organizer._id, organizer)
            }
        )
      }



    this.nullFormField();
    }

  setCategory(value){
    this.category = value
  }

  deleteEvent(organizerId: string, eventId: string){
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

timeSinceInteger(date){
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const interval = seconds / 86400;
  return interval
}

getColor(organizer: Organizer): string{

  if (organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <= 1){
    return 'lightcoral'
  }
  if(1 < organizer.frequency - this.timeSinceInteger(organizer.lastUpdated)
     && organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <= 5){
    return 'orange'
  }
  if (organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) > 5){
    return 'lightgreen'
  }
}

  checkDisabled(){
    if(!this.eventForm.invalid && this.category !== undefined) return false
    else return true
  }

  loadEventsByCategory(category: Category){
      this.eventService.getEventsOnCategory(category).subscribe((events: Event[]) => this.eventsFilteredByCategory = events)
  }

}

