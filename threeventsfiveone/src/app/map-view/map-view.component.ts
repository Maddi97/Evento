import {Component, OnChanges, OnInit, Input} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from "./position.service";
import {Router} from "@angular/router";

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
  address = ""

  current_position = {
    lat: "",
    lon: ""
  }

  constructor(
    private positionService: PositionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const iconRetinaUrl = './assets/marker-icon-2x.png';
    const iconUrl = './assets/marker-icon.png';
    const shadowUrl = './assets/marker-shadow.png';
    this.iconDefault = new L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [16, 24],
      iconAnchor: [8, 30],
      popupAnchor: [1, -26],
      tooltipAnchor: [10, -20],
      shadowSize: [30, 30]
    });

    this.updatePosition(this.positionService.getDefaultLocation())

    L.Marker.prototype.options.icon = this.iconDefault;
  }

  sanitizeInput(value) {
    return value.replace(/ /g, '+')
  }

  updatePosition(location_list) {
    this.current_position.lat = location_list[0]
    this.current_position.lon = location_list[1]
  }

  resetCenter() {
    this.updatePosition(this.positionService.getCurrentPosition())
    this.map.panTo((new L.LatLng(this.current_position.lat, this.current_position.lon)))
  }

  searchForLocationInput() {
    let address = this.sanitizeInput(this.address)

    this.positionService.getPositionByInput(address).toPromise().then(() => {
      this.resetCenter()
      this.router.navigate(['/', 'events'], {queryParams: {'mapUpdate': true}})
    })
  }

  getCurrentPosition() {
    this.positionService.getPositionByLocation().then(() => {
      this.resetCenter()
      this.router.navigate(['/', 'events'], {queryParams: {'mapUpdate': true}})
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
    if (this.current_position.lat === "" || this.current_position.lon === "") {
      this.updatePosition(this.positionService.getCurrentPosition())
    }
    this.map = L.map('map', {
      center: this.current_position,
      zoom: 11
    });

    L.circle([this.current_position.lat, this.current_position.lon], {color: 'red', fillColor: '#f03', radius: 50}).addTo(this.map);
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
