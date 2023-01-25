import {Component, OnChanges, OnInit, Input, OnDestroy, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from './position.service';
import {Router} from '@angular/router';
import {Geolocation} from '@capacitor/geolocation';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() markerData = [];
  @Input() hoveredData = null;
  @Input() zoomInput = 11;
  @Input() centerInput = null;

  private map;
  private markerGroup;
  private positionMarkerGroup;
  private hoverMarkerGroup;
  address = '';

  currentPosition = {
    lat: '',
    lon: ''
  };

  private defaultIconRetina = './assets/leaflet_color_markers/marker-icon-2x-red.png';
  private defaultIcon = './assets/leaflet_color_markers/marker-icon-red.png';
  private shadowUrl = './assets/leaflet_color_markers/marker-shadow.png';

  private locationIcon = './assets/leaflet_color_markers/marker-icon-blue.png';
  private locationIconRetina = './assets/leaflet_color_markers/marker-icon-2x-blue.png';

  private hoverIcon = './assets/leaflet_color_markers/marker-icon-yellow.png';
  private hoverIconRetina = './assets/leaflet_color_markers/marker-icon-2x-yellow.png';


  private LeafIcon = L.Icon.extend({
    options: {
      shadowUrl: this.shadowUrl,
      iconSize: [16, 24],
      iconAnchor: [8, 30],
      popupAnchor: [1, -26],
      tooltipAnchor: [10, -20],
      shadowSize: [30, 30]
    }
  });

  constructor(
    private positionService: PositionService,
    private router: Router
  ) {
  }

  sanitizeInput(value) {
    return value.replace(/ /g, '+');
  }

  ngOnInit(): void {
    // this.positionService.getPositionByLocation().subscribe((res) => {
    //   this.resetCenter();
    // })
    // this.updatePosition(this.positionService.getDefaultLocation());
    if (sessionStorage.getItem('location') !== null) {
      const locationFromSession = JSON.parse(sessionStorage.getItem('location'))
      this.currentPosition.lat = locationFromSession[0]
      this.currentPosition.lon = locationFromSession[1]
      this.setPositionMarker()
    } else {
      this.getCurrentPosition()
    }
  }

  updatePosition(locationList) {
    this.currentPosition.lat = locationList[0];
    this.currentPosition.lon = locationList[1];
  }

  resetCenter() {
    this.updatePosition(this.positionService.getCurrentPosition());
    this.setPositionMarker();
    this.map.panTo((new L.LatLng(this.currentPosition.lat, this.currentPosition.lon)));
    //this.router.navigate(['/', 'events'], {queryParams: {positionUpdate: true}});
  }

  searchForLocationInput() {
    const address = this.sanitizeInput(this.address);

    this.positionService.getPositionByInput(address).subscribe(() => {
      this.resetCenter();
    });
  }

  async getCurrentPosition() {
    // const coordinates = await Geolocation.getCurrentPosition();
    //
    // console.log('Current position:', coordinates);


    this.positionService.getPositionByLocation().subscribe((res) => {
      this.resetCenter();
    });
  }

  ngOnChanges(): void {
    if (typeof this.map === 'undefined') {
      this.initMap();
    }
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.setPositionMarker();
    this.setMarkers(this.markerData);

    if (this.hoveredData !== null) {
      this.setHoverMarker(this.hoveredData.geoData.lat, this.hoveredData.geoData.lon)
    }
  }

  private initMap(): void {

    if (this.centerInput === null) {
      this.map = L.map('map', {
        center: [this.positionService.getDefaultLocation()[0], this.positionService.getDefaultLocation()[1]],
        zoom: this.zoomInput
      });
    } else {
      this.map = L.map('map', {
        center: this.centerInput,
        zoom: this.zoomInput
      });
    }

    this.positionMarkerGroup = L.layerGroup().addTo(this.map);
    this.hoverMarkerGroup = L.layerGroup().addTo(this.map);
    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  private setHoverMarker(lat, lon): void {
    this.hoverMarkerGroup.clearLayers();
    L.marker([lat, lon])
      .setIcon(new this.LeafIcon({iconUrl: this.hoverIcon, iconRetinaUrl: this.hoverIconRetina}))
      .addTo(this.hoverMarkerGroup);
  }

  private setPositionMarker(): void {
    if (this.currentPosition.lat === '0' && this.currentPosition.lon === '0') {
      return
    }

    this.positionMarkerGroup.clearLayers();
    L.marker([this.currentPosition.lat, this.currentPosition.lon])
      .setIcon(new this.LeafIcon({iconUrl: this.locationIcon, iconRetinaUrl: this.locationIconRetina}))
      .addTo(this.positionMarkerGroup);
  }

  private setMarkers(markerData): void {
    let mark = null

    this.markerGroup.clearLayers();
    if (typeof markerData !== 'undefined') {
      markerData.map(marker => {
        if (typeof marker.geoData !== 'undefined') {
          //console.log('Marker: ', marker)
          mark = L.marker([marker.geoData.lat, marker.geoData.lon])
          mark.setIcon(new this.LeafIcon({iconUrl: this.defaultIcon, iconRetinaUrl: this.defaultIconRetina}))
            .addTo(this.markerGroup)
            .bindPopup(
              `<div>${marker.name} </div>`
              +
              `<div class="popup-org-name"> ${marker.organizerName} </div>`
            )
          // mark.on('click', () => {
          //   // console.log(mark)
          //   mark.openPopup();
          // })
        }
      });
    }
  }

}
