import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Event} from '../../models/event';
import {FileService} from '../../file.service';
import {OrganizerService} from '../../organizer.service';


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

  constructor(
    private fileService: FileService,
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
