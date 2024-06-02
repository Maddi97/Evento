import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from "@angular/common";
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { LeafletService } from "@services/core/leaflet/leaflet.service";
import { PositionService } from "@services/core/location/position.service";
import { MapCenterViewService } from "@services/core/map-center-view/map-center-view.service";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from "@globals/models/event";
@Component({
  selector: "map-view",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.css"],
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() markerData: Event[] = [];
  @Input() hoveredData: Event = null;
  @Input() zoomInput = 13;
  @Input() currentPosition: Array<Number>;
  @Input() centerMapOnPosition: Array<Number>;
  @Input() hasMoreEvents: boolean;
  @Input() showInputBar: boolean = true;
  @Input() showHasMoreEvents: boolean = true;
  @Input() isFullEventPage: boolean = false;

  @Output() emitClickedEventId: EventEmitter<any> = new EventEmitter<any>();

  isPositionDefault: boolean;

  isMapDragged = false;
  private isMapDraggedTimeoutRunning: boolean = false;

  mapInitialized = false;
  private map;
  private markerGroup;
  private positionMarkerGroup;
  private hoverMarkerGroup;
  address = "";

  private defaultIconRetina =
    "./assets/leaflet_color_markers/marker-icon-2x-red.png";
  private defaultIcon = "./assets/leaflet_color_markers/marker-icon-red.png";
  private shadowUrl = "./assets/leaflet_color_markers/marker-shadow.png";

  private locationIcon = "./assets/leaflet_color_markers/marker-icon-blue.png";
  private locationIconRetina =
    "./assets/leaflet_color_markers/marker-icon-2x-blue.png";

  private hoverIcon = "./assets/leaflet_color_markers/marker-icon-yellow.png";
  private hoverIconRetina =
    "./assets/leaflet_color_markers/marker-icon-2x-yellow.png";

  private LeafIcon = null;

  constructor(
    private positionService: PositionService,
    private leafletService: LeafletService,
    private mapCenterViewService: MapCenterViewService,
    private sharedObservableService: SharedObservableService,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  sanitizeInput(value) {
    return value.replace(/ /g, "+");
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.LeafIcon = this.leafletService.L.Icon.extend({
        options: {
          shadowUrl: this.shadowUrl,
          iconSize: [16, 24],
          iconAnchor: [8, 30],
          popupAnchor: [1, -26],
          tooltipAnchor: [10, -20],
          shadowSize: [30, 30],
        },
      });
    }
    this.positionService.isPositionDefault.subscribe((isDefault) => {
      this.isPositionDefault = isDefault;
    });
  }

  resetCenter() {
    this.setPositionMarker();
    this.map.panTo(
      new this.leafletService.L.LatLng(
        String(this.centerMapOnPosition[0]),
        String(this.centerMapOnPosition[1])
      )
    );
    //this.router.navigate(['/', 'events'], {queryParams: {positionUpdate: true}});
  }

  searchForLocationInput() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
    this.sharedObservableService.clearSearchFilter();
    const address = this.sanitizeInput(this.address);
    this.positionService.getPositionByInput(address);
    this.address = "";
  }

  async setCurrentPositionOfUserToStorage() {
    this.positionService.getGeoLocation(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    setTimeout(() => {
      this.initMapIfNeeded(); // Use the method to initialize the map
      if (typeof this.map !== "undefined") {
        if (changes.markerData) {
          this.setPositionMarker();
          this.setMarkers(this.markerData);
          this.isMapDragged = false;
        } else if (changes.hoveredData) {
          if (this.hoveredData === null) {
            this.clearHoverMarker();
          } else {
            this.setHoverMarker(
              this.hoveredData.coordinates.lat,
              this.hoveredData.coordinates.lon
            );
          }
        }
        if (changes.currentPosition) {
          this.resetCenter();
        }

        // set blue position marker always to top

        if (isPlatformBrowser(this.platformId))
          this.updateZIndexPosition("blue");
        this.map.on("moveend", (e) => {
          this.updateZIndexPosition("blue");
          this.isMapDragged = true;
          if (!this.isMapDraggedTimeoutRunning) {
            this.isMapDraggedTimeoutRunning = true;

            setTimeout(() => {
              this.isMapDragged = false;
              this.isMapDraggedTimeoutRunning = false; // Reset the flag after the timeout
            }, 5000);
          }
        });
      }
    }, 10); // Adjust the delay time in milliseconds
  }
  private initMapIfNeeded(): void {
    if (
      typeof this.map === "undefined" &&
      this.centerMapOnPosition?.length === 2
    ) {
      this.initMap();
      this.mapInitialized = true;
    }
  }

  @HostListener("touchmove")
  private hideKeyboard() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
  }

  private updateZIndexPosition(color: "blue" | "yellow") {
    const markerElement = document.querySelectorAll("img");
    markerElement.forEach((element) => {
      if (String(element.src).includes(color)) {
        element.style.zIndex = "99999";
        if (color === "blue") {
          element.style.marginLeft = "-2px";
          element.style.marginTop = "-15px";
          element.style.width = "16px";
          element.style.height = "16px";
        }
      }
    });
  }
  private initMap(): void {
    this.map = this.leafletService.L.map("map", {
      center: this.centerMapOnPosition,
      zoom: this.zoomInput,
    });
    const tiles = this.leafletService.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.positionMarkerGroup = this.leafletService.L.layerGroup().addTo(
      this.map
    );

    this.markerGroup = this.leafletService.L.layerGroup().addTo(this.map);
    this.hoverMarkerGroup = this.leafletService.L.layerGroup().addTo(this.map);

    this.map.invalidateSize();
  }

  loadNewEventsOnDrag() {
    this.mapCenterViewService.setMapCenter(this.map.getCenter());
  }

  private setHoverMarker(lat, lon): void {
    this.hoverMarkerGroup.clearLayers();
    this.leafletService.L.marker([lat, lon])
      .setIcon(
        new this.LeafIcon({
          iconUrl: this.hoverIcon,
          iconRetinaUrl: this.hoverIconRetina,
        })
      )
      .addTo(this.hoverMarkerGroup);
    this.updateZIndexPosition("yellow");
  }
  private clearHoverMarker(): void {
    this.hoverMarkerGroup.clearLayers();
  }

  private setPositionMarker(): void {
    if (this.isPositionDefault) return;
    this.positionMarkerGroup.clearLayers();
    const positionMarker = this.leafletService.L.marker(
      this.currentPosition
    ).setIcon(
      new this.LeafIcon({
        iconUrl: this.locationIcon,
        iconRetinaUrl: this.locationIconRetina,
      })
    );
    this.map.removeLayer(positionMarker);
    this.positionMarkerGroup.addLayer(positionMarker);

    positionMarker.zIndexOffset = this.map.getSize().y * 10000;
  }
  searchEventsInNewArea() {
    this.isMapDragged = false;
    this.sharedObservableService.clearSearchFilter();
    this.mapCenterViewService.setMapCenter(this.map.getCenter());
    this.spinner.show();
  }

  private setMarkers(markerData: any[]): void {
    this.markerGroup.clearLayers();
    markerData?.forEach((marker: Event) => {
      const adressStringUrl = encodeURIComponent(
        `${marker.address?.street} ${marker.address?.city}`
      );
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${adressStringUrl}`;
      if (marker.coordinates) {
        const mark = this.leafletService.L.marker([
          marker.coordinates.lat,
          marker.coordinates.lon,
        ])
          .setIcon(
            new this.LeafIcon({
              iconUrl: this.defaultIcon,
              iconRetinaUrl: this.defaultIconRetina,
            })
          )
          .addTo(this.markerGroup)
          .bindPopup(
            `<div>${marker.name}</div>` +
              //`<div *ngIf="false" class="popup-org-name">${marker.organizerName}</div>` +
              `<div>${marker.address?.street}</div>` +
              `<a href="full-event/${marker._id}">Zur Location</a>` +
              `<hr>` +
              `<a target="_blank" rel="noopener noreferrer" href=${gmapsUrl} >Google Maps</a>`
          );
        mark.on("popupclose", () => {
          this.emitClickedEventId.emit({ event: "closed", _id: marker._id });
        });
        mark.on("click", () => {
          // Call your specific function when the marker is clicked
          this.emitClickedEventId.emit({ event: "open", _id: marker._id });
        });
      }
    });
  }
}
