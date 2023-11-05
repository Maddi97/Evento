import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-event-crawled',
  templateUrl: './event-crawled.component.html',
  styleUrls: ['./event-crawled.component.css']
})
export class EventCrawledComponent implements OnInit {
  @Input() eventIn: Event;
  eventProperties;

  ngOnInit(): void {
    this.eventProperties = Object.keys(this.eventIn)

  }
}
