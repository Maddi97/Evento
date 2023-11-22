import { Location } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as moment from "moment";
import { filter } from "rxjs";
import { subDomainUrls } from "../app.component";
import { SessionStorageService } from "../common-utilities/session-storage/session-storage.service";

@Component({
  selector: "app-headerbar",
  templateUrl: "./headerbar.component.html",
  styleUrls: ["./headerbar.component.css"],
})
export class HeaderbarComponent implements OnInit {
  searchText = "";
  isNotEventsPage = false;
  getScreenWidth;
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  constructor(
    private location: Location,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe({
        next: (event: NavigationEnd) => {
          this.isNotEventsPage = false;
          subDomainUrls.forEach(subdomain => {
            if (event.url.includes(subdomain)) {
              this.isNotEventsPage = true;
            }
          })
        },
        error: (error) => {
          // Handle error here
          console.error('An error occurred while fetching categories', error);
        },
        complete: () => {
        }
      })
  }

  navBack() {
    this.location.back();
  }

  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
  }
  changeMapView() {
    this.sessionStorageService.setMapViewData(false);
  }
  getClassOnFullEvent() {
    if (this.isNotEventsPage) {
      return 'fullevent'
    }
    else return ''
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
