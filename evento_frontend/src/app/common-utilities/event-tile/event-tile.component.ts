import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Event} from '../../models/event';
import {FileService} from '../../file.service';
import {OrganizerService} from '../../organizer.service';
import {openingTimesFormatter} from '../logic/opening-times-format-helpers'
import {isScreenMinWidth} from '../logic/screen-size-helpers'

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

  public openingTimesFormatter = openingTimesFormatter;
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
  }

  ngOnChanges() {
    this.distance = Math.round(this.distance * 100) / 100 // 2 decimals
  }

}
