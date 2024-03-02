import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from "@angular/core";
import { ControlContainer } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import {
  Frequency,
  FrequencyKey,
  WeekdayIndex,
} from "@globals/types/date.types";

@Component({
  selector: "app-event-frequency-form",
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: "./event-frequency-form.component.html",
  styleUrls: ["./event-frequency-form.component.css"],
})
export class EventFrequencyFormComponent implements OnChanges {
  @Input() frequencyIn: Frequency;
  @Output() emitFrequency: EventEmitter<Frequency> =
    new EventEmitter<Frequency>();

  frequencyKey: FrequencyKey = "daily";
  selectedDaysInWeekly: WeekdayIndex[] = [];
  selectedDaysInMonthly = undefined;

  ngOnChanges(): void {
    if (this.frequencyIn) {
      this.frequencyKey = Object.keys(this.frequencyIn)[0] as FrequencyKey;
      this.selectedDaysInWeekly = this.frequencyIn[this.frequencyKey];
    }
  }

  emitValue = () => {
    const frequency: Frequency = {
      [this.frequencyKey]: this.selectedDaysInWeekly,
    };

    this.emitFrequency.emit(frequency);
  };
}
