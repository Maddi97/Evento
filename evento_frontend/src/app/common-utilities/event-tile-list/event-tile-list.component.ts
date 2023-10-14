import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { NominatimGeoService } from '../../nominatim-geo.service';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-tile-list',
  templateUrl: './event-tile-list.component.html',
  styleUrls: ['./event-tile-list.component.css']
})
export class EventTileListComponent implements OnInit, OnChanges {
  @Input() fetchEventsCompleted = false;
  @Input() eventList;
  @Input() userPosition;
  @Input() eventToScrollId;
  @Output() hoverEventEmitter = new EventEmitter<string>();

  currentPosition;

  emittedEventId = null;

  hoveredEvent: string = null;
  to: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.sessionStorageService.getLocation().subscribe(location => {
      this.userPosition = location
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventToScrollId) {
      this.scrollToEvent(this.eventToScrollId)
    }
  }

  scrollToEvent(eventToScrollId) {
    if (eventToScrollId) {
      setTimeout(() => {
        const id = "event-tile-" + eventToScrollId
        const element = document.getElementById(id)

        element.scrollIntoView()
      }, 100)
    }
  }
  hover(eventId: string) {
    this.hoverEventEmitter.emit(eventId);
  }

  onClickEvent() {
    this.spinner.show();
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
