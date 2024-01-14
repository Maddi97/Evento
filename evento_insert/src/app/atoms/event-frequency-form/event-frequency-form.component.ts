import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-event-frequency-form",
  templateUrl: "./event-frequency-form.component.html",
  styleUrls: ["./event-frequency-form.component.css"],
})
export class EventFrequencyFormComponent implements OnChanges {
  @Input() frequencyIn;
  @Output() emitFrequency: EventEmitter<any> = new EventEmitter<any>();
  frequency = "daily";
  selectedDaysInWeekly = undefined;
  selectedDaysInMonthly = undefined;

  ngOnChanges(): void {
    console.log(this.frequencyIn);
    this.frequency = Object.keys(this.frequencyIn)[0];
    this.selectedDaysInWeekly = this.frequencyIn[this.frequency];
    console.log(this.frequency, this.selectedDaysInWeekly);
  }

  emitValue = () => {
    const frequency = {
      [this.frequency]: this.selectedDaysInWeekly,
    };

    this.emitFrequency.emit(frequency);
  };
}
