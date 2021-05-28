import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress} from 'src/app/models/organizer';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, map, share, catchError } from 'rxjs/operators';
import { EventsService } from 'src/app/events.service';
import { Event } from '../../models/event';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/category.service';
import { NominatimGeoService } from '../../nominatim-geo.service'
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  updateOrganizerId: string  = '';
  updateEventId: string = '';


  eventForm = this.fb.group({
    name: new FormControl('', []),
    city: new FormControl('Dresden', []),
    plz: new FormControl('', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    country: new FormControl('Deutschland', []),
    description: new FormControl('', []),
    link: new FormControl('', []),
    price: new FormControl('', [])

  })

  categories: Category[]

  date =  new FormControl(new Date())

  category: Category


  times = {
    start: new FormControl("00:00"),
    end: new FormControl("00:00")
  }

  geo_data = {
    lat:  "",
    lon: ""
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
    this.categoryService.categories.subscribe(cat => this.categories = cat)
    this.organizerService.organizers.subscribe(org => this.organizers = org);
    this.eventService.event.subscribe(event => this.allUpcomingEvents = event);
    this.eventService.getAllUpcomingEvents()

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
    const adress = new Adress()
    event._organizerId = organizer._id
    event.name = this.eventForm.get('name').value;
    adress.plz =  this.eventForm.get('plz').value;
    adress.city =  this.eventForm.get('city').value;


    adress.street =  this.eventForm.get('street').value.split(' ').slice(0,-1).join(' ');
    adress.streetNumber =  this.eventForm.get('street').value.split(' ').slice(-1)[0];

    adress.country =  this.eventForm.get('country').value;

    event.adress = adress

    event.description = this.eventForm.get('description').value;
    event.link = this.eventForm.get('link').value;
    event.price = this.eventForm.get('price').value;
    event.category = this.category;
    let date =  this.date.value;
    date.setDate(date.getDate() + 1)
    date = new Date(date.toISOString());
    event.date = date
    const time = {start:this.times.start.value, end: this.times.end.value}
    event.times = time
    event.geo_data = this.geo_data

    // first fetch geo data from osm API and than complete event data type and send to backend
    this.geoService.get_geo_data(adress.city, adress.street, adress.streetNumber).pipe(
      map(geo_data => {
      
      event.geo_data.lat = geo_data[0].lat;
      event.geo_data.lon = geo_data[0].lon;
      }),
      share()
      ).toPromise().then( undefined =>
        this.eventService.createEvent(event).subscribe(event_response => console.log(event_response))
      )

    
    

    // geo_data is observable
    console.log(event)
    organizer.lastUpdated = new Date()
    this.organizerService.updateOrganizer(organizer._id, organizer).subscribe()
    this.nullFormField();
  }


  insertOrgInfo(org: Organizer) {
    this.eventForm.get('plz').setValue(org.adress.plz);
    this.eventForm.get('city').setValue(org.adress.city);
    this.eventForm.get('street').setValue(org.adress.street);
    this.eventForm.get('streetNumber').setValue(org.adress.streetNumber);
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
      price: ''
    })
    this.category = {_id: '', name:'', subcategories: ['']}
    this.date.setValue(new Date())
    this.times.start.setValue('00:00')
    this.times.end.setValue('00:00')
  }

  loadOrganizer(categoryName: string){
    this.organizerService.organizers.subscribe(org => this.organizerOfCategory = org.filter(o => o.category.name === categoryName))
  }

  loadEvents(organizerId: string){

    this.eventService.event.subscribe(event => this.allUpcomingEvents = event);
    this.eventsOfOrganizer = this.allUpcomingEvents.filter(event => event._organizerId === organizerId)
  }

  nullEventsOfOrganizer(){
    this.eventsOfOrganizer = []
  }

  setDate(value){
    let date = new Date(value)
    this.date.setValue(date);
  }

  setEventForm(event: Event) : void{
    console.log(event)
    this.updateEventId = event._id
    const organizer = this.organizers.find(org => org._id === event._organizerId)
    this.organizerName.setValue(organizer.name)
    this.updateOrganizerId = organizer._id
    this.eventForm.setValue({
      name: event.name,
      city: event.adress.city,
      plz: event.adress.plz,
      street: event.adress.street + ' ' + event.adress.streetNumber,
      streetNumber: event.adress.streetNumber,
      country: event.adress.country,
      description: event.description,
      link: event.link,
      price: event.price
    })
    this.category = event.category
    let date = new Date(event.date)
    date.setDate(date.getDate() - 1)
    date = new Date(date.toISOString());
    this.date.setValue(date)
    this.times.start.setValue(event.times.start)
    this.times.end.setValue(event.times.end)
  }


    updateEvent(){
    const organizer = this.organizers.find(org => org.name === this.organizerName.value)
    const event = new Event()
    const adress = new Adress()
    event._organizerId = organizer._id
    event.name = this.eventForm.get('name').value;
    adress.plz =  this.eventForm.get('plz').value;
    adress.city =  this.eventForm.get('city').value;
    adress.street =  this.eventForm.get('street').value.split(' ').slice(0,-1).join(' ');
    adress.streetNumber =  this.eventForm.get('street').value.split(' ').slice(-1)[0];
    adress.country =  this.eventForm.get('country').value;

    event.adress = adress

    event.description = this.eventForm.get('description').value;
    event.link = this.eventForm.get('link').value;
    event.price = this.eventForm.get('price').value;
    event.category = this.category;
    let date =  this.date.value;
    date.setDate(date.getDate() + 1)
    date = new Date(date.toISOString());
    event.date = date
    const time = {start:this.times.start.value, end: this.times.end.value}
    event.times = time
    console.log(event)
    event._id = this.updateEventId
    event.geo_data = this.geo_data
    this.geoService.get_geo_data(adress.city, adress.street, adress.streetNumber).pipe(
      map(geo_data => {
      event.geo_data.lat = geo_data[0].lat;
      event.geo_data.lon = geo_data[0].lon;
      }),
      share()
      ).toPromise().then( moin =>
        {
          this.eventService.updateEvent(event._organizerId,event._id, event).subscribe( event => console.log(event))
          organizer.lastUpdated = new Date()
          this.organizerService.updateOrganizer(organizer._id, organizer)
        }
      )
    

    
    this.nullFormField();
    }

  setCategory(value){
    this.category = value
  }

  deleteEvent(organizerId: string, eventId: string){
    this.eventService.deletEvent(organizerId, eventId).subscribe()

  }

 timeSince(date) {
  
  var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

timeSinceInteger(date){
  var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  var interval = seconds / 86400;
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

}

