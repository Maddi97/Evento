import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventService} from './event.service';
import {Event} from '../models/event';
import {CategoriesService} from '../categories/categories.service';
import {Category, Subcategory} from '../models/category';
import {PositionService} from '../map-view/position.service';
import {NominatimGeoService} from '../nominatim-geo.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, flatMap, map, mergeMap} from 'rxjs/operators';
import {concat} from 'rxjs'

import * as moment from 'moment';
import * as log from 'loglevel';

import {FileService} from '../file.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  public isDropdown = false;

  mapView = false;

  eventList: Event[] = [];
  distanceList = [];
  // List of filtered Events
  filteredList: Event[] = [];
  hoveredEvent: Event = null;
  // Applied filtered Category IDs
  filteredCategory: any = 'hot';

  // filteredSubcategories
  filteredSubcategories = [];

  // clicked date
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })
  ;

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
    private _activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer
    ,
  ) {
  }

  ngOnInit(): void {


    const events$ = this.eventService.events.pipe(
      map(evs => evs.filter(ev => this.get_distance_to_current_position(ev) < this.filteredDistance)
      ),
    )

    // filter events by distance
    events$.subscribe((ev: Event[]) => {
      this.filteredList = ev.sort((ev1, ev2) =>
        this.get_distance_to_current_position(ev1) - this.get_distance_to_current_position(ev2)
      );
    });

    const categories$ = this.categoriesService.categories.pipe(
      map((categories: Category[]) => {
        this.categoryList = categories;
        console.log(categories)
        categories.forEach((category: Category) => {
          category.subcategories.forEach(subcategory => {
            this.subcategoryList.push(subcategory);
          })
        })
      })
    )


    const params$ = this._activatedRoute.queryParams.pipe(
      map(params => {
        const category = params.category;
        if (category !== undefined) {
          this.categoryList.forEach(c => {
            if (c._id === category) {
              this.filteredCategory = c;
            }
          });
        }

        const sub = params.subcategory;
        if (sub !== undefined) {
          this.subcategoryList.forEach(s => {
            if (s._id === sub) {
              this.filteredSubcategories.push(s);
            }
          });
        }
      }));

    categories$
      .pipe(
        mergeMap(() => params$)
      )
      .subscribe(() => this.applyFilters())
    this.downloadSubcategoryIcons()
    this.applyFilters()
    // request categories
    this.categoriesService.getAllCategories();
  }

  ngOnDestroy() {
    this.empty_filters()
  }

  applyFilters() {
    // Request backend for date, category and subcategory filter
    // filter object
    this.currentPosition = this.positionService.getCurrentPosition();
    let fil = {date: this.filteredDate, cat: [], subcat: []};

    if (this.filteredCategory == null) {
      fil.cat = this.categoryList;
    } else {
      fil.cat = [this.filteredCategory];
    }

    if (this.filteredSubcategories.length < 1) {
      fil.subcat = [];
    } else {
      fil.subcat = this.filteredSubcategories;
    }

    this.spinner.show();
    // if category is not hot
    if (!fil.cat.includes('hot')) {
      this.eventService.getEventsOnDateCategoryAndSubcategory(fil);
    } else {
      // if hot filter by date
      this.eventService.getEventsOnDate(this.filteredDate);
    }
    this.spinner.hide();

    fil = {date: this.filteredDate, cat: [], subcat: []};

  }

  get_distance_to_current_position(event) {
    // get distance
    this.currentPosition = this.positionService.getCurrentPosition();
    const dist = this.geoService.get_distance(this.currentPosition, [event.geoData.lat, event.geoData.lon]);
    return dist;
  }

  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
    this.applyFilters();

  }


  searchForDistance(distance) {
    this.distanceChanged = true;
    this.applyFilters();
  }

  // add or remove clicked category to list of filter
  addCategoryToFilter(cat: any) {
    if (this.filteredCategory === cat) {
      return;
    } else {
      this.filteredCategory = cat;
    }

    // if remove category also remove subcategories
    if (cat.subcategories !== undefined) {
      this.filteredSubcategories = [];
    }

    this.applyFilters();
  }

  addSubcategoryToFilter(subcat: Subcategory) {
    if (!this.filteredSubcategories.includes(subcat)) {
      this.filteredSubcategories.push(subcat);
    } else {
      // remove subcat from list
      this.filteredSubcategories = this.filteredSubcategories.filter(obj => obj !== subcat);
    }
    this.applyFilters();
  }

  // change color if category picked
  isElementPicked(cat: any) {
    if (this.filteredCategory === cat || this.filteredSubcategories.includes(cat)) {
      return 'category-picked';
    } else {
      return 'category-non-picked';
    }
  }

  hover(event: Event) {
    this.hoveredEvent = event;
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true;
  }

  empty_filters() {
    this.filteredCategory = []
    this.filteredSubcategories = []
  }


  downloadSubcategoryIcons() {

    this.categoryList.forEach(category => {
      if (category.iconPath !== undefined) {
        if (category.iconTemporaryURL === undefined) {
          this.fileService.downloadFile(category.iconPath).subscribe(imageData => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            category.iconTemporaryURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          });
        }

      }
    });
  }

}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
