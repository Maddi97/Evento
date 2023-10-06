import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NominatimGeoService } from '../../nominatim-geo.service';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Component({
  selector: 'app-event-tile-list',
  templateUrl: './event-tile-list.component.html',
  styleUrls: ['./event-tile-list.component.css']
})
export class EventTileListComponent implements OnInit {
  @Input() fetchEventsCompleted = false;
  @Input() eventList;
  @Input() userPosition;
  @Output() hoverEventEmitter = new EventEmitter<string>();

  currentPosition;

  emittedEventId = null;

  hoveredEvent: string = null;
  to: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private geoService: NominatimGeoService,
  ) {
  }

  ngOnInit(): void {
    this.sessionStorageService.getLocation().subscribe(location => {
      this.userPosition = location
    })
  }


  hover(eventId: string) {
    this.hoverEventEmitter.emit(eventId);
  }

  hoverLeave() {
    this.hoverEventEmitter.emit(null);
  }

  get_distance_to_current_position(event) {
    // get distance
    const dist = this.geoService.get_distance(this.userPosition, [event.geoData.lat, event.geoData.lon]);
    return dist;
  }

}
