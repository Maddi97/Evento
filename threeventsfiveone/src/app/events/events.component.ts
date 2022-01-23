import {Component, OnInit} from '@angular/core';
import {EventService} from './event.service';
import {Event} from '../models/event';
import {CategoriesService} from '../categories/categories.service';
import {Category, Subcategory} from '../models/category';
import {PositionService} from '../map-view/position.service';
import {NominatimGeoService} from '../nominatim-geo.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import * as log from 'loglevel';
import {filter, map} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  eventList: Event[] = [];
  distanceList = [];
  // List of filtered Events
  filteredList: Event[] = [];

  // Applied filtered Category IDs
  filteredCategory: any = 'hot';

  //filteredSubcategories
  filteredSubcategories = [];

  //clicked date
  filteredDate: Date = new Date();

  // Range for the events
  filteredDistance = 10;

  // List of events in range to current position with filteredDistance
  eventsInRange = [];

  // Range of events to current position
  eventDistances = {};

  distanceChanged = true;
  currentPosition;

  // List of all Categories
  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private positionService: PositionService,
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {


    this.eventService.events.pipe(
      map(evs => evs.filter(ev => this.get_distance_to_current_position(ev) < this.filteredDistance )),
    ).subscribe((ev: Event[]) => {
      this.filteredList=ev;
    });

    this.categoriesService.categories.subscribe((cat: Category[]) => {
      this.categoryList = cat;

      // add subcats to list
      cat.forEach(c => {
        c.subcategories.forEach(sub => {
          this.subcategoryList.push(sub)
        })
      })

      this._activatedRoute.queryParams.subscribe(
        params => {
          let cat = params['category']
          if (cat != undefined) {
            this.categoryList.forEach(c =>
            {
              if (c._id == cat) this.filteredCategory = c
            })
          }

          let sub = params['subcategory']
          if (sub != undefined)
            this.subcategoryList.forEach( s => {
              if (s._id == sub) {
                this.filteredSubcategories.push(s)
              }
            })
        });


      this.applyFilters()
    });

    //request categories
    this.categoriesService.getAllCategories();
  }

  applyFilters() {
    //Request backend for date, category and subcategory filter
    //filter object
    this.currentPosition = this.positionService.getCurrentPosition();

    let fil = {date: this.filteredDate, cat: [], subcat: []}

    if (this.filteredCategory == null) fil.cat = this.categoryList
    else fil.cat = [this.filteredCategory]

    if(this.filteredSubcategories.length < 1) fil.subcat = []
    else fil.subcat = this.filteredSubcategories

    this.spinner.show();
    // if category is not hot
    if (!fil.cat.includes('hot')) {
      this.eventService.getEventsOnDateCategoryAndSubcategory(fil)
    }
    else {
      // if hot filter by date
      this.eventService.getEventsOnDate(this.filteredDate)
    }
    this.spinner.hide();

  }
  get_distance_to_current_position(event)
  {
    //get distance
    this.currentPosition = this.positionService.getCurrentPosition()
    let dist = this.geoService.get_distance(this.currentPosition, [event.geo_data.lat, event.geo_data.lon])
    return dist

  }

  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date
    this.applyFilters()

  }


  searchForDistance(distance) {
    this.distanceChanged = true;
    this.applyFilters()
  }

  //add or remove clicked category to list of filter
  addCategoryToFilter(cat: any){
    if (this.filteredCategory == cat) {
      return
    }
    else this.filteredCategory = cat

    //if remove category also remove subcategories
    if(cat.subcategories != undefined){
      this.filteredSubcategories = []
    }

    this.applyFilters()
  }
  addSubcategoryToFilter(subcat: Subcategory){
    if (!this.filteredSubcategories.includes(subcat)) {
      this.filteredSubcategories.push(subcat)
    } else {
      //remove subcat from list
      this.filteredSubcategories = this.filteredSubcategories.filter(obj => obj !== subcat);
    }
    this.applyFilters()
  }

 // change color if category picked
  isElementPicked(cat: any) {
    if (this.filteredCategory == cat || this.filteredSubcategories.includes(cat)) {
      return 'category-picked';
    } else {
      return 'category-non-picked';
    }
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true;
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
