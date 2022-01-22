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
  filteredCategory:Category;

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


    this.eventService.events.subscribe((ev: Event[]) => {
      this.eventList = ev;
      this.filteredList = ev;
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
      console.log(this.filteredSubcategories)


      this.applyFilters()
    });

    //request categories
    this.categoriesService.getAllCategories();
  }

  applyFilters() {
    //Request backend for date, category and subcategory filter
    //filter object
    let filter = {date: this.filteredDate, cat: [], subcat: []}

    if (this.filteredCategory == null) filter.cat = this.categoryList
    else filter.cat = [this.filteredCategory]

    if(this.filteredSubcategories.length < 1) filter.subcat = []
    else filter.subcat = this.filteredSubcategories

    this.currentPosition = this.positionService.getCurrentPosition();
    this.filteredList = []
    this.spinner.show();
    this.eventService.getEventsOnDateCategoryAndSubcategory(filter).subscribe(
      events => {
        events.forEach(event => {
         // TODO is too slow
          // this.filterByDistance(event)
        });

      }
    )
    this.spinner.hide();

  }

  filterByDistance(event)
  {
    //filter by distance
    this.geoService.get_distance(this.currentPosition, [event.geo_data.lat, event.geo_data.lon]).subscribe(
      geo => {
        let dist = geo['routes'][0].distance / 1000
        if (dist < this.filteredDistance) this.filteredList.push(event)
      }
    )
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
  addCategoryToFilter(cat: Category){
    if (this.filteredCategory == cat) {
      this.filteredCategory = null
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
