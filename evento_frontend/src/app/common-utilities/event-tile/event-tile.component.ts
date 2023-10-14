import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { OrganizerService } from '../../organizer.service';
import { dateTimesFormater, openingTimesFormatter } from '../logic/opening-times-format-helpers';
import { isScreenMinWidth } from '../logic/screen-size-helpers';

@Component({
  selector: 'app-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit, OnChanges {

  @Input() event: Event;
  @Input() distance;

  IconURL = null;
  ImageURL = null;
  organizer = null;
  hasUserPosition = false;
  public openingTimesFormatter = openingTimesFormatter;
  public dateTimesFormater = dateTimesFormater;
  public isScreenMinWidth = isScreenMinWidth;

  constructor(
    private organizerService: OrganizerService,
  ) {
  }

  ngOnInit(): void {
    this.organizerService.getOrganizerById(this.event._organizerId).subscribe(
      organizerResponse => {
        this.organizer = organizerResponse[0];
      }
    );
    this.distance = Math.round(this.distance * 100) / 100 // 2 decimals
    this.hasUserPosition = !JSON.parse(sessionStorage.getItem("defaultLocation"))
  }

  ngOnChanges() {
    this.distance = Math.round(this.distance * 100) / 100 // 2 decimals
  }

}
