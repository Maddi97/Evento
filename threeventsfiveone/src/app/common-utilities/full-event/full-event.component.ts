import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/events/event.service';

@Component({
  selector: 'vents-full-event',
  templateUrl: './full-event.component.html',
  styleUrls: ['./full-event.component.css']
})
export class FullEventComponent implements OnInit {

  eventId: string;

  event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,

  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(r => {
      this.eventId = r;
      this.event = this.eventService.eventForId(this.eventId);
      console.log(this.event);
    });
  }

}
