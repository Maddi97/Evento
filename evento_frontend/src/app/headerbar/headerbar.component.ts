import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import * as moment from "moment";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { SessionStorageService } from "../common-utilities/session-storage/session-storage.service";

@Component({
  selector: "app-headerbar",
  templateUrl: "./headerbar.component.html",
  styleUrls: ["./headerbar.component.css"],
})
export class HeaderbarComponent implements OnInit {
  searchText = "";
  fullEventPage = false;
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
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes("full-event")) {
          this.fullEventPage = true;
        } else {
          this.fullEventPage = false;
        }
      });
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
    if (this.fullEventPage) {
      return 'fullevent'
    }
    else return ''
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
