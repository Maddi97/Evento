import {
  CommonModule,
  Location,
  isPlatformBrowser,
  isPlatformServer,
} from "@angular/common";
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { SUBDOMAIN_URLS } from "@globals/constants/subdomainUrls";
import { MapCenterViewService } from "@services/core/map-center-view/map-center-view.service";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";
import { HamburgerMenuComponent } from "@shared/atoms/hamburger-menu/hamburger-menu.component";
import moment from "moment";
import { filter } from "rxjs";
import { SearchFilterComponent } from "../search-filter/search-filter.component";
import { DatePickerComponent } from "../date-picker/date-picker.component";
@Component({
  selector: "app-headerbar",
  standalone: true,
  imports: [
    HamburgerMenuComponent,
    SearchFilterComponent,
    DatePickerComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: "./headerbar.component.html",
  styleUrls: ["./headerbar.component.css"],
})
export class HeaderbarComponent implements OnInit {
  searchText = "";
  isNotEventsPage = false;
  isMapView = false;
  getScreenWidth;
  scrollOut: Boolean = false;
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  isPlatformServer: boolean;
  constructor(
    private location: Location,
    private router: Router,
    private sharedObservables: SharedObservableService,
    private mapCenterViewService: MapCenterViewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenWidth = window.innerWidth;
    }
    this.isPlatformServer = isPlatformServer(this.platformId);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          this.isNotEventsPage = false;
          this.scrollOut = false;
          SUBDOMAIN_URLS.forEach((subdomain) => {
            if (event.url.includes(subdomain)) {
              this.isNotEventsPage = true;
            }
          });
        },
        error: (error) => {
          // Handle error here
          console.error("An error occurred while fetching categories", error);
        },
        complete: () => {},
      });
    this.mapCenterViewService.isMapViewObservable.subscribe((isMapView) => {
      this.isMapView = isMapView;
      if (isMapView) {
        this.scrollOut = false;
      }
    });
    this.sharedObservables.scrollOutInOfScreenObservable.subscribe(
      (scrollOut) => {
        this.scrollOut = scrollOut && !this.isNotEventsPage && !this.isMapView;
      }
    );
  }

  navBack() {
    this.location.back();
  }

  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
  }
  changeMapView() {
    this.mapCenterViewService.setMapViewData(false);
  }
  getClassOnFullEvent() {
    if (this.isNotEventsPage) {
      return "fullevent";
    } else return "";
  }
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.getScreenWidth = window.innerWidth;
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
