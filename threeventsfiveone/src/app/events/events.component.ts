import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../models/event';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../models/category';
import {MatSliderChange} from "@angular/material/slider";
import {PositionService} from "../map-view/position.service";
import {NominatimGeoService} from "../nominatim-geo.service";
import {map} from "rxjs/operators";
import {async} from "@angular/core/testing";
import {valueReferenceToExpression} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  eventRange = 10

  eventList: Event[] = [];
  filteredList: Event[] = [];
  filteredCategories = [];

  categoryList: Category[] = [];

  current_position = []

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private positionService: PositionService,
    private geoService: NominatimGeoService
  ) { }

  ngOnInit(): void {
    this.eventService.events.subscribe((ev: Event[]) => {
      this.eventList = ev;
      this.filteredList = this.eventList;
      if (ev.length === 0) {
        this.eventService.getAllEvents();
      }
    });
    this.categoriesService.categories.subscribe((cat: Category[]) => {
      this.categoryList = cat;
      if (cat.length === 0) {
        this.categoriesService.getAllCategories();
      }
    });
    this.positionService.position.subscribe( (pos: Array<any>) => {
      this.current_position = pos;
      if (pos.length === 0) {
        this.positionService.getCurrentPosition()
      }
    })

    // ToDo
    console.log(this.current_position)
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return  value / 10 + 'km';
    }

    return value;
  }

  searchForDay(filter: DateClicked) {
    console.log(filter);
    if (filter.isClicked) {
      this.filteredList = this.filteredList
      .filter(f => (new Date(f.date).getDay() === filter.date.getDay() && new Date(f.date).getMonth() === filter.date.getMonth()));
    } else {
      this.filteredList = this.eventList;
    }
  }

  searchForCategory(cat: Category) {
    this.filteredList = this.filteredList.filter(f => f.category._id === cat._id);
    this.filteredCategories.push(cat._id)
  }

  searchForDistance(sliderEvent: MatSliderChange) {
    // this.filteredList = this.filteredList.filter( event => {
    //   if (event.geo_data === undefined) {
    //     // ToDo wait with distance for this call
    //     // ToDo can probably never happen, as all events need a position
    //     // this.geoService.get_geo_data(event.adress.city, event.adress.street, event.adress.streetNumber).pipe(
    //     //   map( data => {
    //     //     event.geo_data.lat = data[0].lat
    //     //     event.geo_data.lon = data[0].lon
    //     //   })
    //     // )
    //     return false
    //   }
    //
    //   let filtered

    console.log(this.filteredList)
    this.filteredList.forEach(event => {
      this.geoService.get_distance(this.positionService.getCurrentPosition(), [event.geo_data.lat, event.geo_data.lon]).subscribe(map(
        distance_object => {
          console.log(distance_object)
          this.filteredList = this.filteredList.filter(filterEvent => (filterEvent === event && distance_object.routes[0].distance / 1000 < sliderEvent.value))
        }))
    })
      // console.log(filtered)
      // return filtered
    // })
  }

  isElementPicked(cat: Category) {
    if (this.filteredCategories.includes(cat._id)) {
      return 'category-picked'
    }
    else {
      return 'category-non-picked'
    }
  }

  clearFilter() {
    this.filteredList = this.eventList;
    this.filteredCategories = []
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
