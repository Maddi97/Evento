import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Event } from '../../models/event';
import { EventService } from '../../events/event.service';
import { PositionService } from '../map-view/position.service';
import { NominatimGeoService } from '../../nominatim-geo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-event-tile-list',
  templateUrl: './event-tile-list.component.html',
  styleUrls: ['./event-tile-list.component.css']
})
export class EventTileListComponent implements OnInit {
  @Input() eventList;
  @Output() hoverEventEmitter = new EventEmitter<string>();

  private events$;
  currentPosition;

  emittedEventId = null;

  hoveredEvent: string = null;
  to: any;

  constructor(
        private positionService: PositionService,
    private geoService: NominatimGeoService,
  ) {
  }

  ngOnInit(): void {
  }

  hover(eventId: string) {
    this.hoverEventEmitter.emit(eventId);
  }

  hoverLeave() {
    this.hoverEventEmitter.emit(null);
  }

    get_distance_to_current_position(event) {
    // get distance
    this.currentPosition = this.positionService.getCurrentPosition();
    const dist = this.geoService.get_distance(this.currentPosition, [event.geoData.lat, event.geoData.lon]);
    return dist;
  }

}
