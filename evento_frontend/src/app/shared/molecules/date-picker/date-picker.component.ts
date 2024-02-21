import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { MatCalendar } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomRouterService } from "@services/core/custom-router/custom-router.service";
import { DayDateComponent } from "@shared/atoms/day-date/day-date.component";
import moment from "moment";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-date-picker",
  standalone: true,
  imports: [MatIconModule, CommonModule, DayDateComponent],
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
  params$;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private customRouterService: CustomRouterService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.params$ = this.customRouterService.queryParamsSubject
      .pipe(
        map((params) => {
          const date = params.date;
          if (date && !this.isDateSmallerThanYesterday(date)) {
            this.selectedDate = this.removeTimezoneAndTimeFromDate(
              new Date(date)
            );
          }
        }),
        tap((params) => {
          this.createDateList();
        })
      )
      .subscribe();
  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenWidth = window.innerWidth;

      if (this.getScreenWidth > 700) {
        this.numberOfDates = Number(this.getScreenWidth / 100);
      } else {
        this.numberOfDates = 30;
      }
      this.setScrollMaxBool();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollToClicked();
    }
  }
  ngOnDestroy() {
    this.params$.unsubscribe();
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
    }, 10);
  }

  addDates() {
    this.numberOfDates += this.displayNumberOfDates;
    this.createDateList(true);
    this.firstDate += this.displayNumberOfDates;
  }

  removeTimezoneAndTimeFromDate(date) {
    date = moment(date.toISOString()).utcOffset(0, false);
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return date;
  }

  async scrollRight() {
    const element = document.getElementById("scroll-date-picker");
    element.scrollLeft += 160;
    setTimeout(() => {
      this.setScrollMaxBool();
    }, 10);
    // if max scrolled true then true
  }

  async scrollLeft() {
    const element = document.getElementById("scroll-date-picker");
    element.scrollLeft -= 160;
    setTimeout(() => {
      this.setScrollMaxBool();
    }, 10);
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

  private isDateSmallerThanYesterday(date: Date): Boolean {
    // Get today's date
    const today = new Date();
    // Set the time part of today's date to 0 (midnight)
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Set the time part of the input date to 0 (midnight)
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 0, 0, 0);

    // Compare the adjusted date with yesterday's date
    return adjustedDate < yesterday;
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
