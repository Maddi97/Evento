import { Component, HostListener, OnInit } from "@angular/core";
import { Event } from "../models/event";
import * as moment from "moment";
import { debounceTime, map, mergeMap, take, timer } from "rxjs";
import { EventService } from "./event.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from "@angular/router";
import { PositionService } from "../common-utilities/map-view/position.service";
import { NominatimGeoService } from "../nominatim-geo.service";
import { CategoriesService } from "../categories/categories.service";
import { Category, Subcategory } from "../models/category";
import { SessionStorageService } from "../common-utilities/session-storage/session-storage.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
})
export class EventsComponent implements OnInit {
  public isDropdown = false;
  private events$;

  actualLoadEventLimit = 8;
  startLoadEventLimit = 8;
  offset = 3;

  currentPosition;
  mapView = null;
  mapView$;
  eventList: Event[] = [];
  // Applied filtered Category IDs

  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];
  hot = { name: "hot" };
  loadMore = false;

  hoveredEventId = null;
  filteredCategory = this.hot;
  // filteredSubcategories
  filteredSubcategories = [];
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;
  // clicked date
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  public getScreenWidth: any;

  constructor(
    private eventService: EventService,
    private spinner: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute,
    private positionService: PositionService,
    private geoService: NominatimGeoService,
    private categoriesService: CategoriesService,
    private sessionStorageService: SessionStorageService
  ) {
    this.mapView = this.sessionStorageService.getMapViewData();
    if (this.mapView === null) {
      this.sessionStorageService.setMapViewData(false); // Set the default value here as a boolean
      this.mapView = false;
    }

    this.mapView$ = this.sessionStorageService
      .mapViewChanges()
      .subscribe((data) => {
        this.mapView = data;
      });
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.spinner.show();
    this.events$ = this.eventService.events.subscribe((events) => {
      this.eventList = events;
      this.loadMore = this.eventList.length >= this.actualLoadEventLimit;
      this.spinner.hide();
    });
    const categories$ = this.categoriesService.categories.pipe(
      map((categories: Category[]) => {
        this.categoryList = categories;
        categories.forEach((category: Category) => {
          category.subcategories.forEach((subcategory) => {
            this.subcategoryList.push(subcategory);
          });
        });

      })
    );

    const params$ = this._activatedRoute.queryParams.pipe(
      map((params) => {
        this.filteredDate = moment(new Date(params.date))
          .utcOffset(0, false)
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          });
        const category = params.category;
        if (category !== undefined) {
          this.categoryList.forEach((c) => {
            if (c._id === category) {
              this.filteredCategory = c;
            }
          });
        } else {
          this.filteredCategory = this.hot;
        }

        let subcategories = params.subcategory;
        if (subcategories !== undefined) {
          this.subcategoryList.forEach((s) => {
            if (subcategories.includes(s._id)) {
              this.filteredSubcategories.push(s);
            }
          });
        }
      })
    );

    categories$
      .pipe(
        mergeMap(() => params$),
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }
  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters() {
    // Request backend for date, category and subcategory filter
    // filter object
    this.currentPosition = this.positionService.getCurrentPosition();
    const fil = {
      date: this.filteredDate,
      cat: [this.filteredCategory],
      subcat: this.filteredSubcategories,
      limit: this.actualLoadEventLimit,
      currentPosition: this.currentPosition,
    };
    // this.spinner.show();
    // if category is not hot
    if (!fil.cat.find((el) => el.name === "hot")) {
      this.eventService.getEventsOnDateCategoryAndSubcategory(fil);
    } else {
      // if hot filter by date
      this.eventService.getEventsOnDate(this.filteredDate);
    }
    // this.spinner.hide();
  }
  get_distance_to_current_position(event) {
    // get distance
    this.currentPosition = this.positionService.getCurrentPosition();
    const dist = this.geoService.get_distance(this.currentPosition, [
      event.geoData.lat,
      event.geoData.lon,
    ]);
    return dist;
  }

  loadMoreEvents() {
    this.actualLoadEventLimit += this.offset;
    this.applyFilters();
  }

  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
  }

  getEventFromId() {
    const event = this.eventList.find(
      (event) => event._id === this.hoveredEventId
    );
    return event || null;
  }

  triggerCategoryOutput(cat) {
    this.filteredCategory = cat;
    this.applyFilters();
  }

  triggerSubcategoryOutput(subcats) {
    this.filteredSubcategories = subcats;
    this.applyFilters();
  }

  changeToMapView() {
    this.mapView ? (this.mapView = false) : (this.mapView = true);
    this.sessionStorageService.setMapViewData(this.mapView);
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool();
  }

  scrollRight() {
    const element = document.getElementById("main-category-container");
    element.scrollLeft += 80;
    this.setScrollMaxBool();
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById("main-category-container");
    element.scrollLeft -= 80;
    this.setScrollMaxBool();
  }

  @HostListener("window:mouseover", ["$event"])
  setScrollMaxBool() {
    const element = document.getElementById("main-category-container");
    this.scrollLeftMax = element.scrollLeft === 0;
    this.scrollRightMax =
      element.scrollLeft === element.scrollWidth - element.clientWidth;
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
