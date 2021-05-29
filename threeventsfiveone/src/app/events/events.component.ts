import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../models/event';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../models/category';
import {MatSliderChange} from "@angular/material/slider";
import {PositionService} from "../map-view/position.service";
import {NominatimGeoService} from "../nominatim-geo.service";

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

  searchForDistance(event: MatSliderChange) {
    // ToDo -> at event creation update coordinates! -> backend geo-data -> attach to event?
    this.filteredList.forEach( event => {
      // if (event.adress.longitude === undefined) {
      //   let promise = this.geoService.get_geo_data(event.adress.city, event.adress.street, event.adress.streetNumber).pipe(
      //     map( data => {
      //       event.adress.longitude = data[1]
      //       event.adress.longitude = data[0]
      //     }
      //   )).toPromise()
      //  promise.then(() => {this.geoService.get_distance(this.current_position, [event.adress.latitude, event.adress.longitude])})
      // }
      // else {
      if (event.adress.longitude !== undefined) {
        this.geoService.get_distance(this.current_position, [event.adress.latitude, event.adress.longitude])
      }
      else {
        console.log('hm')
      }
    })


    this.eventRange = event.value
    console.log('event_range: ' + this.eventRange)
    console.log(event.value)
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
