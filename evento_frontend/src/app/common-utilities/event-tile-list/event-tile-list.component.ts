import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Event} from '../../models/event';
import {EventService} from '../../events/event.service';
import {PositionService} from '../map-view/position.service';
import {NominatimGeoService} from '../../nominatim-geo.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-event-tile-list',
  templateUrl: './event-tile-list.component.html',
  styleUrls: ['./event-tile-list.component.css']
})
export class EventTileListComponent implements OnInit, OnChanges {
  @Input() filteredDate;
  @Input() categories;
  @Input() subcategories;

  @Output() eventListEmitter = new EventEmitter<Event[]>();
  @Output() hoverEventEmitter = new EventEmitter<Event>();

  private events$;
  eventList;
  actualLoadEventLimit = 8;
  startLoadEventLimit = 8;
  offset = 3;

  hoveredEvent: Event = null;

  currentPosition;

  constructor(
    private eventService: EventService,
    private positionService: PositionService,
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.events$ = this.eventService.events.subscribe(
      events => {
        this.eventList = events;
        this.eventListEmitter.emit(this.eventList);
      }
    )
  }

  ngOnChanges(): void {
    this.applyFilters()
  }


  get_distance_to_current_position(event) {
    // get distance
    this.currentPosition = this.positionService.getCurrentPosition();
    const dist = this.geoService.get_distance(this.currentPosition, [event.geoData.lat, event.geoData.lon]);
    return dist;
  }

  applyFilters() {
    // Request backend for date, category and subcategory filter
    // filter object
    this.currentPosition = this.positionService.getCurrentPosition();
    const fil = {
      date: this.filteredDate,
      cat: this.categories,
      subcat: this.subcategories,
      limit: this.actualLoadEventLimit,
      currentPosition: this.currentPosition
    };

    // this.spinner.show();
    // if category is not hot
    if (!fil.cat.includes('hot')) {
      this.eventService.getEventsOnDateCategoryAndSubcategory(fil);
    } else {
      // if hot filter by date
      this.eventService.getEventsOnDate(this.filteredDate);
    }
    // this.spinner.hide();
  }

  hover(event: Event) {
    this.hoverEventEmitter.emit(event)
  }

  loadMoreEvents() {
    this.actualLoadEventLimit += this.offset;
    this.applyFilters();
  }
}
