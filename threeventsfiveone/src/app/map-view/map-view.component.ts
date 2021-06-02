import {Component, OnChanges, OnInit, Input} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from "./position.service";

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() marker_data = [];
  private map;
  private markerGroup
  private iconDefault
  private positionIcon
  address = "Address"

  current_position = []

  constructor(
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    const iconRetinaUrl = './assets/marker-icon-2x.png';
    const iconUrl = './assets/marker-icon.png';
    const shadowUrl = './assets/marker-shadow.png';
    this.iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [16, 24],
      iconAnchor: [8, 30],
      popupAnchor: [1, -26],
      tooltipAnchor: [10, -20],
      shadowSize: [30, 30]
    });

    this.positionIcon = L.icon({

    })

    this.current_position = this.positionService.getDefaultLocation()

    L.Marker.prototype.options.icon = this.iconDefault;
  }

  sanitizeInput(value) {
    return value.replace(/ /g, '+')
  }

  resetCenter() {
    this.current_position = this.positionService.getCurrentPosition()
    this.map.panTo((new L.LatLng(this.current_position[0], this.current_position[1])))
  }

  searchForLocationInput() {
    let address = this.sanitizeInput(this.address)

    this.positionService.getPositionByInput(address).toPromise().then(() => {
      this.resetCenter()
    })
  }

  getCurrentPosition() {
    this.positionService.getPositionByLocation().then(() => {
      this.resetCenter()
    })
  }

  ngOnChanges(): void {
    if (typeof this.map == 'undefined') {
      this.initMap()
    }
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.setMarkers(this.marker_data)
  }

  private initMap(): void {
    if (this.current_position.length === 0) {
      this.current_position = this.positionService.getCurrentPosition()
    }
    this.map = L.map('map', {
      center: this.current_position,
      zoom: 11
    });

    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  private setMarkers(marker_data): void {
    this.markerGroup.clearLayers();
    if (typeof marker_data != 'undefined') {
      marker_data.map(marker => {
        if (typeof marker.geo_data != 'undefined') {
          L.marker([marker.geo_data.lat, marker.geo_data.lon], this.iconDefault)
            .addTo(this.markerGroup)
        }
      })
    }
  }
}


// https://nominatim.openstreetmap.org/search?q=Philipp-Rosenthal-Straße+31,Leipzig&limit=2&format=json
