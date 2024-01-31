import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from "@angular/core";
import { NominatimGeoService } from "@services/core/location/nominatim-geo.service";
import { PositionService } from "@services/core/location/position.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-event-tile-list",
  templateUrl: "./event-tile-list.component.html",
  styleUrls: ["./event-tile-list.component.css"],
})
export class EventTileListComponent implements OnInit, OnChanges {
  @Input() eventList;
  @Input() userPosition;
  @Input() eventToScrollId;
  @Input() test;
  @Output() hoverEventEmitter = new EventEmitter<string>();

  emittedEventId = null;

  hoveredEvent: string = null;
  to: any;

  showAds = false;

  constructor(
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventToScrollId && isPlatformBrowser(this.platformId)) {
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
