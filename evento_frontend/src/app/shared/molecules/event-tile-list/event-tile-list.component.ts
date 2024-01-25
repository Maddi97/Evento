import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { NominatimGeoService } from "@services/core/location/nominatim-geo.service";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-event-tile-list",
  templateUrl: "./event-tile-list.component.html",
  styleUrls: ["./event-tile-list.component.css"],
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

  showAds = false;

  constructor(
    private sessionStorageService: SessionStorageService,
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.sessionStorageService.getLocation().subscribe((location) => {
      this.userPosition = location;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventToScrollId) {
      this.scrollToEvent(
        this.eventToScrollId,
        changes.eventToScrollId.previousValue
      );
    }
  }

  scrollToEvent(eventToScroll, previousEventToScroll) {
    setTimeout(() => {
      const id = "event-tile-" + eventToScroll?._id;
      const previousId = "event-tile-" + previousEventToScroll?._id;
      const element = document.getElementById(id);

      if (eventToScroll?.event === "open") {
        element?.scrollIntoView(
          { behavior: "smooth", block: "start" } // Use smooth scrolling
        );
        var styleTarget = element?.children[0]?.children[0];
        styleTarget.classList.add("map-clicked");
      }
      if (
        eventToScroll?._id !== previousEventToScroll?._id ||
        eventToScroll?.event === "closed"
      ) {
        var styleTarget =
          document.getElementById(previousId)?.children[0]?.children[0];
        // Add the class
        styleTarget?.classList.remove("map-clicked");
      }
    }, 1);
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
    const dist = this.geoService.get_distance(this.userPosition, [
      event.geoData.lat,
      event.geoData.lon,
    ]);
    return dist;
  }
}
