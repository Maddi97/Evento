import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, map, mergeMap, skip, take } from "rxjs/operators";

@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.css"],
})
export class DatePickerComponent implements OnInit, AfterViewInit {
  @Output() clickedDate = new EventEmitter<DateClicked>();

  @ViewChild(MatCalendar) datePicker: MatCalendar<Date>;

  public getScreenWidth: any;

  public nextMonth: DateClicked[] = [];
  public numberOfDates = 10;
  public displayNumberOfDates = 5;
  public firstDate = 0;
  startDate = new Date();
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
      this.numberOfDates = 7;
    }
    const params$ = this._activatedRoute.queryParams.pipe(
      map((params) => {
        const date = params.date;
        if (date !== undefined) {
          this.startDate = new Date(date);
        }
      })
    );

    params$
      .pipe(
        debounceTime(1),
        mergeMap(() => this.createDateList())
      )
      .subscribe(() => this.scrollToClicked());
    this.setScrollMaxBool();
  }

  ngAfterViewInit() {
    this.scrollToClicked();
  }

  safeDate(day: moment.Moment) {
    this.nextMonth.map((m) => {
      if (m.date === day) {
        m.isClicked = true;
      } else {
        m.isClicked = false;
      }
    });
    const emitDate = this.nextMonth.find((m) => m.date === day);
    this.clickedDate.emit(emitDate);
    this.setRouteParameter({
      date: emitDate.date.clone().format("YYYY-MM-DD"),
    });
  }

  async createDateList(dontClick = false) {
    const thisDay = moment(
      this.nextMonth[this.firstDate - 1]
        ? this.transformDateFormat(new Date())
        : this.transformDateFormat(new Date())
    );
    let differencesParamDateTodayDays = moment(this.startDate).diff(
      thisDay,
      "days"
    );
    if (differencesParamDateTodayDays < 0) {
      differencesParamDateTodayDays = 0;
    }
    if (differencesParamDateTodayDays > this.numberOfDates)
      this.numberOfDates = differencesParamDateTodayDays + this.numberOfDates;

    for (let i = this.firstDate; i < this.numberOfDates; i++) {
      const day = thisDay.clone().add(i, "days");

      this.nextMonth[i] = new DateClicked();
      this.nextMonth[i].date = day;
      if (i === differencesParamDateTodayDays) {
        this.safeDate(this.nextMonth[i].date);
      } else {
        this.nextMonth[i].isClicked = false;
      }
    }
  }

  @HostListener("scroll") onScroll(e: Event): void {
    this.getYPosition(e);
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
    }, 200);
  }

  getYPosition(e: Event): void {}

  addDates() {
    // TODO maybe try to add number of dates dynamically
    this.numberOfDates += this.displayNumberOfDates;
    this.firstDate += this.displayNumberOfDates;
    this.createDateList(true);
  }

  transformDateFormat(date) {
    date = moment(date.toISOString()).utcOffset(0, false);
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    // date.toISOString()
    return moment(date);
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
