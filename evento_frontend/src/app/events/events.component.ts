import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment-timezone';
import { NgxSpinnerService } from "ngx-spinner";
import { map, switchMap } from "rxjs";
import { CategoriesService } from "../categories/categories.service";
import { PositionService } from '../common-utilities/map-view/position.service';
import { SessionStorageService } from "../common-utilities/session-storage/session-storage.service";
import { Category, Subcategory } from "../models/category";
import { Event } from "../models/event";
import { NominatimGeoService } from "../nominatim-geo.service";
import { EventService } from "./event.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"],
})
export class EventsComponent implements OnInit {
  public isDropdown = false;

  //Observables
  private events$: Array<any> = [];
  private categories$;
  // equal limit at start == start limit
  actualLoadEventLimit;
  startLoadEventLimit = 24;
  offset = 19;

  fetchEventsCompleted = false;
  currentPosition;
  mapView = null;
  mapView$;
  eventList: Event[] = [];
  // Applied filtered Category IDs

  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];
  hot = { name: "hot" };
  loadMore = false;

  isLoadMoreClicked = false
  eventToScrollId = undefined
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

  public getScreenWidth: number;

  constructor(
    private eventService: EventService,
    private spinner: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute,
    private positionService: PositionService,
    private geoService: NominatimGeoService,
    private categoriesService: CategoriesService,
    private sessionStorageService: SessionStorageService
  ) {
    this.actualLoadEventLimit = this.startLoadEventLimit;
    this.mapView = this.sessionStorageService.getMapViewData();
    if (this.mapView === null) {
      this.sessionStorageService.setMapViewData(false);
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
    this.closeSpinnerAfterTimeout();

    this.setupPositionService();
    this.setupCategoriesService();

  }

  private setupPositionService(): void {
    this.sessionStorageService.getLocation().subscribe(position => {
      this.currentPosition = position;
      this.applyFilters()
    });
  }

  private setupCategoriesService(): void {
    this.categoriesService.getAllCategories().subscribe(
      {
        next: (categories) => {
          this.categoryList = categories;

          categories.forEach((category: Category) => {
            category.subcategories.forEach((subcategory) => {
              this.subcategoryList.push(subcategory);
            });
          });
        },
        error: (error) => { console.log(error) },
        complete: () => {
          console.log('Categories complete')
          this.setupQueryParams();
        }
      }
    )
  }

  private setupQueryParams(): void {
    this._activatedRoute.queryParams.subscribe(
      {
        next: (params) => {
          this.fetchEventsCompleted = false;
          this.spinner.show();
          this.filteredDate = moment(params.date).tz('Europe/Berlin');

          const category = params.category;
          this.filteredCategory = category
            ? this.categoryList.find(c => c._id === category)
            : this.hot;

          const subcategories = params.subcategory;
          this.filteredSubcategories = subcategories
            ? this.subcategoryList.filter(s => subcategories.includes(s._id))
            : [];
          this.applyFilters()
        },
        error: (error) => { console.log(error) },
      });
  }


  ngOnDestroy() {
    this.events$.forEach((event$) => {
      if (event$) {
        event$.unsubscribe()
      }
    })
  }

  applyFilters() {
    // Request backend for date, category and subcategory filter
    // filter object
    //format date because in post request it is stringified and formatted, this could change the date
    const fil = {
      date: this.filteredDate.format('YYYY-MM-DDTHH:mm:ss'),
      cat: [this.filteredCategory],
      subcat: this.filteredSubcategories,
      limit: this.actualLoadEventLimit,
      currentPosition: this.currentPosition,
    };
    let event$;
    // if category is not hot
    if (!fil.cat.find((el) => el.name === "hot")) {
      event$ = this.eventService.getEventsOnDateCategoryAndSubcategory(fil).subscribe(
        {
          next: (events) => {
            this.handlyEventListLoaded(events)
          },
          error: (error) => { console.log(error) },
          complete: () => { this.onFetchEventsCompleted() }
        });
    } else {
      // if hot filter by date
      event$ = this.eventService.getEventsOnDate(this.filteredDate).subscribe(
        {
          next: (events) => {
            this.handlyEventListLoaded(events)
          },
          error: (error) => { console.log(error) },
          complete: () => { this.onFetchEventsCompleted() }
        });
    }
    this.events$.push(event$)
  }
  get_distance_to_current_position(event) {
    // get distance
    const dist = this.geoService.get_distance(this.currentPosition, [
      event.geoData.lat,
      event.geoData.lon,
    ]);
    return dist;
  }

  loadMoreEvents() {
    this.spinner.show()
    this.closeSpinnerAfterTimeout();
    this.isLoadMoreClicked = true
    this.actualLoadEventLimit += this.offset;
    this.applyFilters()

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
  }

  triggerSubcategoryOutput(subcats) {
    this.filteredSubcategories = subcats;
  }

  changeToMapView() {
    this.mapView ? (this.mapView = false) : (this.mapView = true);
    this.sessionStorageService.setMapViewData(this.mapView);
  }

  onFetchEventsCompleted() {
    this.fetchEventsCompleted = true;
    this.spinner.hide()
  }

  handlyEventListLoaded(events: Event[]) {
    const indexLastEvent = this.eventList.length
    this.eventList = events;
    this.loadMore = this.eventList.length >= this.actualLoadEventLimit;
    if (this.isLoadMoreClicked) {
      this.isLoadMoreClicked = false;
      this.eventToScrollId = this.eventList[indexLastEvent - 2]._id
    }
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
  closeSpinnerAfterTimeout() {
    setTimeout(() => {
      this.spinner.hide()
    }, 10000)
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
