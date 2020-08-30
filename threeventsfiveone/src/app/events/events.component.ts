import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../models/event';

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  eventList: Event[] = [];

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.eventService.getAllEvents();
    this.eventService.events.subscribe((ev: Event[]) => {
      this.eventList = ev;
      console.log(ev);
    });
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return  value / 10 + 'km';
    }

    return value;
  }

  searchForDay(filter: Date) {
    console.log(filter);
  }
}
