import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-event-frequency-form",
  templateUrl: "./event-frequency-form.component.html",
  styleUrls: ["./event-frequency-form.component.css"],
})
export class EventFrequencyFormComponent {
  @Output() emitFrequency: EventEmitter<any> = new EventEmitter<any>();
  frequency = "daily";
  selectedDaysInWeekly = undefined;
  selectedDaysInMonthly = undefined;

  emitValue = () => {
    const frequency = {
      [this.frequency]: this.selectedDaysInWeekly,
    };
    console.log(frequency);
    this.emitFrequency.emit(frequency);
  };
}
