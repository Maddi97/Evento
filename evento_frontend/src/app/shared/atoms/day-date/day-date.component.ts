import { Component, OnInit, Input } from "@angular/core";
import moment from "moment";
import { WEEKDAYS_SHORT } from "@globals/constants/dates";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-day-date",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./day-date.component.html",
  styleUrls: ["./day-date.component.css"],
})
export class DayDateComponent implements OnInit {
  @Input() date: moment.Moment;
  @Input() isClicked = false;

  public isYesterday = false;
  public isToday = false;
  public isNextYear = false;

  constructor() {}

  ngOnInit(): void {
    if (this.date.isSame(moment().subtract(1, "day"), "day")) {
      this.isYesterday = true;
    }

    if (this.date.isSame(moment(), "day")) {
      this.isToday = true;
    }
    if (this.date.isSame(moment().add(1, "year"), "year")) {
      this.isNextYear = true;
    }
  }

  dayToString(): string {
    return WEEKDAYS_SHORT[this.date.day()];
  }

  dateToString(): string {
    if (!this.isNextYear) {
      return this.date.format("DD.MM");
    } else {
      return this.date.format("DD.MM.YY");
    }
  }
  isDateClicked() {
    if (this.isClicked) {
      return "day-date-clicked";
    } else {
      return "day-date";
    }
  }
}
