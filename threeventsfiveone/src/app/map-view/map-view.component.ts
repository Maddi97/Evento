import {AfterViewInit, Component, OnChanges, OnInit, Input} from '@angular/core';
import * as L from 'leaflet';
import {NominatimGeoService} from "../nominatim-geo.service";
import { startWith, map, share, catchError } from 'rxjs/operators';


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

  private current_position
  // private default_center_position = [51.33962, 12.37129]
  private default_center_position = [40.7142700, -74.0059700]


  constructor(
    private geoService: NominatimGeoService
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

    L.Marker.prototype.options.icon = this.iconDefault;
  }

  sanitizeInput(value) {
    // ToDo sanitize input
    return value
  }

  resetCenter(geoArray) {
    if (geoArray[0] !== undefined) {
      this.map.panTo(new L.LatLng(geoArray[0], geoArray[1]))
    }
    else {
      this.map.panTo((new L.LatLng(this.default_center_position[0], this.default_center_position[1])))
    }
  }

  searchForLocationInput(address) {
    address = this.sanitizeInput(address)

    console.log('map_view: ' + address)

    let searched_center = []

    this.geoService.get_geo_data_address(address).pipe(
      map(geo_data => {
        searched_center = [geo_data[0].lat, geo_data[0].lon]
      }),share())

    console.log(searched_center[0])
    this.resetCenter(searched_center)
  }

  getCurrentPosition() {
    console.log('test')
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.current_position = [latitude, longitude]

      this.resetCenter(this.current_position)
    });
  }

  ngOnChanges(): void {
    if (typeof this.map == 'undefined') {
      this.initMap()
    }
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.setMarkers(this.marker_data)
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.default_center_position,
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
