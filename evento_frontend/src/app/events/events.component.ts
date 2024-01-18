import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment-timezone";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription, delay, tap } from "rxjs";
import { CategoriesService } from "../categories/categories.service";
import { SharedObservableService } from "../common-utilities/logic/shared-observables.service";
import { PositionService } from "../common-utilities/map-view/position.service";
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
export class EventsComponent implements OnInit, OnDestroy {
  public isDropdown = false;

  //Observables
  private subscriptions$: Array<Subscription> = [];
  isLoadingMoreEvents = false;
  private lastScrollPosition = 0;

  // equal limit at start == start limit
  actualLoadEventLimit;
  startLoadEventLimit = 16;
  offset = 14;

  fetchEventsCompleted = false;
  fetchParamsCompleted = false;
  currentPosition;
  mapView = null;
  mapView$;
  eventList: Event[] = [];
  // Applied filtered Category IDs

  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];
  hot = { name: "hot" };

  searchString: string = "";

  loadMore = false;
  isLoadMoreClicked = false;
  hasLoadedMore = true;

  eventToScrollId = undefined;
  hoveredEventId = null;
  filteredCategory = this.hot;
  lastEventListLength = 0;
  hasMoreEventsToLoad = true;
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
    private geoService: NominatimGeoService,
    private categoriesService: CategoriesService,
    private sessionStorageService: SessionStorageService,
    private positionService: PositionService,
    private sharedObservables: SharedObservableService
  ) {
    this.actualLoadEventLimit = this.startLoadEventLimit;
    this.mapView = this.sessionStorageService.getMapViewData();
    if (this.mapView === null) {
      this.sessionStorageService.setMapViewData(false);
      this.mapView = false;
    }

    const mapView$ = this.sessionStorageService
      .mapViewChanges()
      .subscribe((data) => {
        this.mapView = data;
      });
    this.subscriptions$.push(mapView$);
    this.spinner.show();
  }
  ngOnDestroy(): void {
    this.subscriptions$.forEach((subscription$) => {
      if (subscription$) {
        subscription$.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.spinner.show();
    this.closeSpinnerAfterTimeout();

    //this.setupPositionService();
    this.setupCategoriesService();
    this.setupSearchFilterSubscription();
  }

  private setupSearchFilterSubscription() {
    const search$ = this.sessionStorageService.searchStringSubject.subscribe(
      (searchString: string) => {
        this.spinner.show();
        this.searchString = searchString;
        const date = moment(new Date()).utcOffset(0, false).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        const req = {
          searchString: searchString,
          limit: this.actualLoadEventLimit,
          date: date,
          categories: this.categoryList.map((cat) => cat._id),
        };
        const event$ = this.eventService
          .getEventsBySearchString(req)
          .subscribe({
            next: (events) => {
              if (!searchString) {
                this.applyFilters();
              } else {
                this.handlyEventListLoaded(events);
              }
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.onFetchEventsCompleted();
            },
          });
        this.subscriptions$.push(event$);
      }
    );
    this.subscriptions$.push(search$);
  }

  private setupPositionService(): void {
    if (!this.sessionStorageService.getUserLocationFromStorage()) {
      this.positionService.getPositionByLocation();
    }
    const storageLocationObservation$ = this.sessionStorageService
      .getLocation()
      .pipe()
      .subscribe((position) => {
        if (position) {
          this.eventList = [];
        }
        if (!this.searchString) {
          this.currentPosition = position;
          this.applyFilters();
        }
      });
    const newCenter$ =
      this.sessionStorageService.searchNewCenterSubject.subscribe(
        (mapCenterPosition) => {
          this.loadMoreEvents(mapCenterPosition);
        }
      );
    this.subscriptions$.push(storageLocationObservation$, newCenter$);
  }

  private setupCategoriesService(): void {
    const categories$ = this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoryList = this.sortCategoriesByWeight(categories);

        categories.forEach((category: Category) => {
          category.subcategories.forEach((subcategory) => {
            this.subcategoryList.push(subcategory);
          });
        });
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("Categories complete");
        this.setupQueryParams();
      },
    });
    this.subscriptions$.push(categories$);
  }

  private setupQueryParams(): void {
    const params$ = this._activatedRoute.queryParams
      .pipe(
        tap(() => {
          this.spinner.show();
        }),
        delay(200)
      )
      .subscribe({
        next: (params) => {
          if (params.date || params.categories) {
            this.eventList = [];
          }
          this.resetLoadingLimit();
          this.fetchEventsCompleted = false;
          this.filteredDate = moment(params.date);
          // append the hours of the current time zone because the post request will automatically
          // change to time with time zone an this could change the date
          this.filteredDate.add(moment(new Date()).utcOffset() / 60, "hours");
          const category = params.category;
          this.filteredCategory = category
            ? this.categoryList.find((c) => c._id === category)
            : this.categoryList[0];

          if (params.subcategory) {
            this.filteredSubcategories = this.subcategoryList.filter((s) =>
              params.subcategory.includes(s._id)
            );
          } else {
            this.filteredSubcategories = [];
          }
          this.fetchParamsCompleted = true;
          this.setupPositionService();
          //this.applyFilters()
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions$.push(params$);
  }

  applyFilters(mapCenter = undefined) {
    // Request backend for date, category and subcategory filter
    // filter object
    //format date because in post request it is stringified and formatted, this could change the date
    const germanyTime = new Date().toLocaleTimeString("en-DE", {
      timeZone: "Europe/Berlin",
    });

    const fil = {
      date: this.filteredDate,
      time: germanyTime,
      cat: [this.filteredCategory],
      subcat: this.filteredSubcategories,
      limit: this.actualLoadEventLimit,
      currentPosition: mapCenter ? mapCenter : this.currentPosition,
    };
    let event$;
    // if category is not hot
    if (!fil.cat.find((el) => el.name === "hot")) {
      event$ = this.eventService
        .getEventsOnDateCategoryAndSubcategory(fil)
        .subscribe({
          next: (events) => {
            this.handlyEventListLoaded(events);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.onFetchEventsCompleted();
          },
        });
    } else {
      // if hot filter by date

      event$ = this.eventService
        .getEventsOnDate(this.filteredDate, germanyTime)
        .subscribe({
          next: (events) => {
            this.handlyEventListLoaded(events);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.onFetchEventsCompleted();
          },
        });
    }
    this.subscriptions$.push(event$);
  }
  get_distance_to_current_position(event) {
    // get distance
    const dist = this.geoService.get_distance(this.currentPosition, [
      event.geoData.lat,
      event.geoData.lon,
    ]);
    return dist;
  }

  loadMoreEvents(mapCenter = undefined) {
    if (this.loadMore) {
      console.log("Loading more events");
      this.isLoadMoreClicked = mapCenter ? false : true;
      this.actualLoadEventLimit += this.offset;
      this.applyFilters(mapCenter);
    }
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

  changeToMapView() {
    this.mapView ? (this.mapView = false) : (this.mapView = true);
    this.sessionStorageService.setMapViewData(this.mapView);
  }

  onFetchEventsCompleted() {
    this.fetchEventsCompleted = true;
    if (this.lastEventListLength <= this.eventList.length) {
      this.hasMoreEventsToLoad = false;
    }
    this.lastEventListLength = this.eventList.length;
    this.spinner.hide();
  }

  handlyEventListLoaded(events: Event[]) {
    const indexLastEvent = this.eventList.length;
    this.eventList = events;
    this.loadMore = this.eventList.length >= this.actualLoadEventLimit;
    if (this.isLoadMoreClicked) {
      this.isLoadMoreClicked = false;
      this.eventToScrollId = this.eventList[indexLastEvent - 3]?._id;
    }
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool();
  }

  scrollRight() {
    const element = document.getElementById("main-category-container");
    if (element) {
      element.scrollLeft += 80;
    }
    this.setScrollMaxBool();
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById("main-category-container");
    if (element) {
      element.scrollLeft -= 80;
    }
    this.setScrollMaxBool();
  }

  @HostListener("window:mouseover", ["$event"])
  setScrollMaxBool() {
    const element = document.getElementById("main-category-container");
    if (element) {
      this.scrollLeftMax = element.scrollLeft === 0;
      this.scrollRightMax =
        element.scrollLeft === element.scrollWidth - element.clientWidth;
    }
  }

  onScroll(event): void {
    const element = event.target;
    const distanceToTop: number = element.scrollTop;
    const distanceToBottom =
      element.scrollHeight - element.clientHeight - element.scrollTop;
    if (this.isScrollingDown(element)) {
      //this.sharedObservables.notifyScrolling("down");
      const scroll = {
        direction: "down" as any,
        distanceTop: distanceToTop,
        distanceBottom: distanceToBottom,
      };
      this.sharedObservables.notifyScrollOutInOfScreen(scroll);
    } else {
      const scroll = {
        direction: "up" as any,
        distanceTop: distanceToTop,
        distanceBottom: distanceToBottom,
      };
      this.sharedObservables.notifyScrollOutInOfScreen(scroll);
      // this.sharedObservables.notifyScrolling("up");
    }
    // Check if the div is scrolled to the bottom
    if (
      this.isScrolledToBottom(element) &&
      !this.isLoadingMoreEvents &&
      this.loadMore
    ) {
      this.isLoadingMoreEvents = true;
      this.loadMoreEvents();
      setTimeout(() => {
        this.isLoadingMoreEvents = false;
      }, 750);
    }
  }

  isScrolledToBottom(element: HTMLElement): boolean {
    const atBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
    return atBottom;
  }

  // return true if scrolling down, false if scrolling up
  isScrollingDown(element: HTMLElement) {
    const currentScrollPosition = element.scrollTop;

    if (currentScrollPosition > this.lastScrollPosition) {
      this.lastScrollPosition = currentScrollPosition;
      return true;
    }
    // Check if scrolling up
    else if (currentScrollPosition < this.lastScrollPosition) {
      this.lastScrollPosition = currentScrollPosition;
      return false;
    }
  }
  sortCategoriesByWeight(categoryList) {
    return categoryList.sort((a, b) => {
      const weightA = a.weight ? parseFloat(a.weight) : 0;
      const weightB = b.weight ? parseFloat(b.weight) : 0;
      return weightB - weightA;
    });
  }
  private resetLoadingLimit() {
    this.actualLoadEventLimit = this.startLoadEventLimit;
  }
  closeSpinnerAfterTimeout() {
    setTimeout(() => {
      this.spinner.hide();
    }, 10000);
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
