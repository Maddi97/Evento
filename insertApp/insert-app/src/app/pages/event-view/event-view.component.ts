import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress} from 'src/app/models/organizer';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { EventsService } from 'src/app/events.service';
import { Event , EventDate} from '../../models/event';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  eventForm = this.fb.group({
    name: new FormControl('', []),
    city: new FormControl('Dresden', []),
    plz: new FormControl('01127', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    country: new FormControl('Deutschland', []),
    description: new FormControl('', []),
    category: new FormControl('', [])
  })


  todaysDate = this.getActualDate()

  eventDate: EventDate = {
    day: this.todaysDate,
    start: '00:00',
    end: '00:00',
  }

  organizerName = new FormControl();
  organizers: Organizer[] = [];
  filteredOptions: Observable<string[]>;
  allEvents: Event[] = [];
  eventsOfOrganizer: Event[]; 
    constructor(
    private organizerService: OrganizerService,
    private eventService: EventsService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.organizerService.organizers.subscribe(org => this.organizers = org);
    this.eventService.event.subscribe(event => this.allEvents = event);
    this.eventService.getAllEvents()

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
    adress.street =  this.eventForm.get('street').value;
    adress.streetNumber =  this.eventForm.get('streetNumber').value;
    adress.country =  this.eventForm.get('country').value;

    event.adress = adress

    event.description = this.eventForm.get('description').value;
    event.category = this.eventForm.get('category').value;

    event.date = this.eventDate;
    this.eventService.createEvent(event);
    this.nullFormField();
  }

  getActualDate(){
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

   return  mm + '/' + dd + '/' + yyyy;
  }

  insertOrgInfo(org: Organizer) {
    this.eventForm.get('plz').setValue(org.adress.plz);
    this.eventForm.get('city').setValue(org.adress.city);
    this.eventForm.get('street').setValue(org.adress.street);
    this.eventForm.get('streetNumber').setValue(org.adress.streetNumber);
  }

  nullFormField() {
    this.eventForm.setValue({
      name: '',
      city: 'Dresden',
      plz: '',
      street: '',
      streetNumber: '',
      country: 'Deutschland',
      description: '',
      category: ''
    })
  }

  loadEvents(organizerId: string){
    this.eventsOfOrganizer = this.allEvents.filter(event => event._organizerId === organizerId)

  }

  nullEventsOfOrganizer(){
    this.eventsOfOrganizer = []
  }

}
