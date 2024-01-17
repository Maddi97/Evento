import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { debounceTime, map, mergeMap, tap } from "rxjs/operators";

@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.css"],
})
export class DatePickerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatCalendar) datePicker: MatCalendar<Date>;

  public getScreenWidth: any;

  public listOfDisplayedDates: DateClicked[] = [];
  public numberOfDates = 30;
  public displayNumberOfDates = 30;
  public firstDate = 0;
  selectedDate = this.removeTimezoneAndTimeFromDate(new Date());

  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 700) {
      this.numberOfDates = Number(this.getScreenWidth / 100);
    } else {
      this.numberOfDates = 30;
    }
    const params$ = this._activatedRoute.queryParams.pipe(
      map((params) => {
        const date = params.date;
        if (date) {
          this.selectedDate = this.removeTimezoneAndTimeFromDate(
            new Date(date)
          );
        }
      }),
      tap()
    );

    params$
      .pipe(
        debounceTime(1),
        mergeMap(() => this.createDateList())
      )
      .subscribe(() => {
        this.scrollToClicked();
      });
    this.setScrollMaxBool();
  }

  ngAfterViewInit() {
    this.scrollToClicked();
  }

  safeDate(emitDate: DateClicked) {
    emitDate.isClicked = true;
    this.setRouteParameter({
      date: emitDate.date.format("YYYY-MM-DD"),
    });
  }

  async createDateList(dontClick = false) {
    const differenceOfDays = this.selectedDate.diff(moment(new Date()), "days");
    if (
      this.selectedDate.diff(
        moment(new Date()).add(this.numberOfDates, "days"),
        "days"
      ) > this.numberOfDates
    ) {
      this.numberOfDates =
        differenceOfDays < 0
          ? this.numberOfDates
          : differenceOfDays + this.numberOfDates;
    }
    const yesterday = this.removeTimezoneAndTimeFromDate(
      moment(new Date()).subtract(1, "days")
    );
    //create a day from yesterday until the number of dates
    for (let i = 0; i < this.numberOfDates; i++) {
      const day = this.removeTimezoneAndTimeFromDate(
        yesterday.clone().add(i, "days")
      );
      this.listOfDisplayedDates[i] = new DateClicked();
      this.listOfDisplayedDates[i].date = day;
      if (day.isSame(this.selectedDate)) {
        this.safeDate(this.listOfDisplayedDates[i]);
      } else {
        this.listOfDisplayedDates[i].isClicked = false;
      }
    }
  }

  onScroll(e: Event): void {
    const targetElement = e.target as HTMLElement;

    // Check if the target element has scrolled horizontally to the end
    const isScrolledToRightEnd =
      targetElement.scrollLeft + targetElement.clientWidth >=
      targetElement.scrollWidth - 5;
    if (isScrolledToRightEnd) {
      this.addDates();
    }
  }

  scrollToClicked() {
    setTimeout(() => {
      const element: HTMLElement = document.getElementById("day-date-clicked");
      if (!element) return;
      const container: HTMLElement = document.querySelector(".scroll");

      if (!container) return;
      // Apply the calculated scroll position
      //container.scrollLeft = scrollPosition;
      element.scrollIntoView({ block: "end", inline: "center" });
    }, 100);
  }

  addDates() {
    // TODO maybe try to add number of dates dynamically
    this.numberOfDates += this.displayNumberOfDates;
    this.createDateList(true);
    this.firstDate += this.displayNumberOfDates;
  }

  removeTimezoneAndTimeFromDate(date) {
    date = moment(date.toISOString()).utcOffset(0, false);
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    // date.toISOString()
    return date;
  }

  async scrollRight() {
    const element = document.getElementById("scroll-date-picker");
    element.scrollLeft += 160;
    setTimeout(() => {
      this.setScrollMaxBool();
    }, 100);
    // if max scrolled true then true
  }

  async scrollLeft() {
    const element = document.getElementById("scroll-date-picker");
    element.scrollLeft -= 160;
    setTimeout(() => {
      this.setScrollMaxBool();
    }, 100);
  }

  @HostListener("window:mouseover", ["$event"])
  setScrollMaxBool() {
    const element = document.getElementById("scroll-date-picker");

    this.scrollLeftMax = element.scrollLeft === 0;
    this.scrollRightMax =
      element.scrollLeft === element.scrollWidth - element.clientWidth;
  }

  setRouteParameter(params) {
    this.router.navigate([], {
      queryParams: params,
      relativeTo: this._activatedRoute,
      queryParamsHandling: "merge",
    });
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
