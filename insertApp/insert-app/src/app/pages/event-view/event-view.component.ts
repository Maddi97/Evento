import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer } from 'src/app/models/organizer';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { EventsService } from 'src/app/events.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  organizerName = new FormControl();
  organizers: Organizer[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private organizerService: OrganizerService,
    private eventService: EventsService,

  ) { }

  ngOnInit(): void {
    this.organizerService.organizers.subscribe(o => this.organizers = o);

    this.filteredOptions = this.organizerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    const event = new Event();
    event._organizerId = '5f40133d0777d345df982edc';
    event.title = 'test';
    this.createEvent(event);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.organizers.map(o => o.name).filter(o => o.toLowerCase().includes(filterValue));
  }

  createEvent(event: Event) {
    this.eventService.createEvent(event);
  }

}
