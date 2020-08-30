import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event';

@Component({
  selector: 'vents-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit {

  @Input() event: Event;

  constructor() { }

  ngOnInit(): void {
    console.log(this.event);
  }

}
