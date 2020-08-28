import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress} from 'src/app/models/organizer';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { EventsService } from 'src/app/events.service';
import { Event , EventDate} from '../../models/event';

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
    category: new FormControl('', []),
    description: new FormControl('', [])
  })

  todaysDate = this.getActualDate()

  eventDate: EventDate = {
    day: this.todaysDate,
    start: '00:00',
    end: '00:00',
  }

  organizerName = new FormControl();
  organizers: Organizer[] = [];
  filteredOptions: Observable<String[]>;
  constructor(
    private organizerService: OrganizerService,
    private eventService: EventsService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.organizerService.organizers.subscribe(org => this.organizers = org);

    this.filteredOptions = this.organizerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
//    const event = new Event();
  }

  private _filter(value: Organizer): string[] {
    console.log(value)
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
  }

  getActualDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

   return  mm + '/' + dd + '/' + yyyy;
  }

}
