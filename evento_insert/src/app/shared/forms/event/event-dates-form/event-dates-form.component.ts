import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";

import { EventFrequencyFormComponent } from "@shared/atoms/event-frequency-form/event-frequency-form.component";
import moment from "moment";

@Component({
  selector: "app-event-dates-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EventFrequencyFormComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./event-dates-form.component.html",
  styleUrl: "./event-dates-form.component.css",
})
export class EventDatesFormComponent {
  parentContainer = inject(ControlContainer);

  public isEventPermanentForm: FormControl<boolean> = new FormControl(false);
  // public hasUnkownOpeningTimesForm: FormControl<boolean> = new FormControl(
  //   false
  // );
  public frequencyForm: FormControl = new FormControl(undefined, [
    Validators.required,
  ]);

  public dateFormGroup: FormGroup = new FormGroup({
    start: new FormControl<moment.Moment>(undefined, [Validators.required]),
    end: new FormControl<moment.Moment>(undefined, [Validators.required]),
  });

  //not in event
  public isFrequentCheck: FormControl<boolean> = new FormControl(false);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl("permanent", this.isEventPermanentForm);
    this.parentFormGroup.addControl("date", this.dateFormGroup);
  }

  isFrequencyChanged(isFrequency: boolean) {
    if (isFrequency) {
      this.parentFormGroup.addControl("frequency", this.frequencyForm);
    } else {
      this.removeFrequency();
    }
  }
  isPermanentChanged() {
    if (!this.isEventPermanentForm.value) {
      this.addValidators(this.dateFormGroup);
      this.removeFrequency();
    } else {
      this.removeValidators(this.dateFormGroup);
    }
  }

  removeFrequency() {
    this.parentFormGroup.removeControl("frequency");
    this.frequencyForm.reset();
  }
  removeValidators(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      // Get the control
      const control = formGroup.get(key);
      // Clear validators
      control.clearValidators();
      // Update value and validity
      control.updateValueAndValidity();
    });
  }
  addValidators(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get[key].setValidators([Validators.required]);
      formGroup.get(key).updateValueAndValidity();
    });
  }
}
