import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import * as L from "leaflet";
import { PositionService } from "../../services/location/position.service";
import { Event } from "@globals/models/event";
@Component({
  selector: "app-map-view",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.css"],
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() markerData: Event[] = [];
  @Input() hoveredData: Event = null;
  @Input() zoomInput = 12;
  @Input() centerInput = null;

  private map;
  private mapInitialized;
  private markerGroup;
  private positionMarkerGroup;
  private hoverMarkerGroup;
  address = "";

  currentPosition = {
    lat: "",
    lon: "",
  };

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

  private LeafIcon = L.Icon.extend({
    options: {
      shadowUrl: this.shadowUrl,
      iconSize: [16, 24],
      iconAnchor: [8, 30],
      popupAnchor: [1, -26],
      tooltipAnchor: [10, -20],
      shadowSize: [30, 30],
    },
  });

  constructor(private positionService: PositionService) {}

  sanitizeInput(value) {
    return value.replace(/ /g, "+");
  }

  ngOnInit(): void {
    // this.positionService.getPositionByLocation().subscribe((res) => {
    //   this.resetCenter();
    // })
    // this.updatePosition(this.positionService.getDefaultLocation());
    this.initMapIfNeeded(); // Use the method to initialize the map
  }

  resetCenter() {
    this.setPositionMarker();
    this.map.panTo(
      new L.LatLng(this.currentPosition.lat, this.currentPosition.lon)
    );
    //this.router.navigate(['/', 'events'], {queryParams: {positionUpdate: true}});
  }

  searchForLocationInput() {
    const address = this.sanitizeInput(this.address);

    this.positionService.getPositionByInput(address).then(() => {
      this.resetCenter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.initMapIfNeeded(); // Use the method to initialize the map

      if (changes.markerData) {
        const tiles = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );
        tiles.addTo(this.map);
        this.setPositionMarker();

        this.setMarkers(this.markerData);
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
    }, 10); // Adjust the delay time in milliseconds
  }
  private initMapIfNeeded(): void {
    if (typeof this.map === "undefined") {
      this.initMap();
      this.mapInitialized = true;
    }
  }

  private initMap(): void {
    if (this.centerInput === null) {
      this.map = L.map("map", {
        center: [
          this.positionService.getDefaultLocation()[0],
          this.positionService.getDefaultLocation()[1],
        ],
        zoom: this.zoomInput,
      });
    } else {
      this.map = L.map("map", {
        center: this.centerInput,
        zoom: this.zoomInput,
      });
    }
    this.positionMarkerGroup = L.layerGroup().addTo(this.map);

    this.markerGroup = L.layerGroup().addTo(this.map);
    this.hoverMarkerGroup = L.layerGroup().addTo(this.map);

    this.map.invalidateSize();
  }

  private setHoverMarker(lat, lon): void {
    this.hoverMarkerGroup.clearLayers();
    L.marker([lat, lon])
      .setIcon(
        new this.LeafIcon({
          iconUrl: this.hoverIcon,
          iconRetinaUrl: this.hoverIconRetina,
        })
      )
      .addTo(this.hoverMarkerGroup);
  }
  private clearHoverMarker(): void {
    this.hoverMarkerGroup.clearLayers();
  }

  private setPositionMarker(): void {
    if (this.currentPosition.lat === "0" && this.currentPosition.lon === "0") {
      return;
    }
    this.positionMarkerGroup.clearLayers();
    const positionMarker = L.marker([
      this.currentPosition.lat,
      this.currentPosition.lon,
    ]).setIcon(
      new this.LeafIcon({
        iconUrl: this.locationIcon,
        iconRetinaUrl: this.locationIconRetina,
      })
    );
    this.map.removeLayer(positionMarker);
    this.positionMarkerGroup.addLayer(positionMarker);
    positionMarker.zIndexOffset = this.map.getSize().y * 10000;
  }

  private setMarkers(markerData: any[]): void {
    this.markerGroup.clearLayers();
    markerData.forEach((marker: Event) => {
      const adressStringUrl = encodeURIComponent(
        `${marker.address?.street} ${marker.address?.city}`
      );
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${adressStringUrl}`;
      if (marker.coordinates) {
        const mark = L.marker([marker.coordinates.lat, marker.coordinates.lon])
          .setIcon(
            new this.LeafIcon({
              iconUrl: this.defaultIcon,
              iconRetinaUrl: this.defaultIconRetina,
            })
          )
          .addTo(this.markerGroup)
          .bindPopup(
            `<div>${marker.name}</div>` +
              `<div class="popup-org-name">${marker.organizerName}</div>` +
              `<div>${marker.address?.street}</div>` +
              `<a href="full-event/${marker._id}">Zum Event!</a>` +
              `<hr>` +
              `<a target="_blank" rel="noopener noreferrer" href=${gmapsUrl} >Google Maps</a>`
          );
      }
    });
  }
}
