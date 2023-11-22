import { Component, Input } from '@angular/core';
import { Event } from 'src/app/models/event';
import { Organizer } from 'src/app/models/organizer';

@Component({
  selector: 'app-event-crawled',
  templateUrl: './event-crawled.component.html',
  styleUrls: ['./event-crawled.component.css']
})
export class EventCrawledComponent {
  @Input() eventIn: Event;
  @Input() organizerIn: Organizer;
}
