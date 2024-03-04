import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { OPENING_TIMES_TEMPLATE } from "@globals/constants/common.c";
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "app-opening-times-form",
  standalone: true,
  imports: [
    CommonModule,
    NgxMaterialTimepickerModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./opening-times-form.component.html",
  styleUrl: "./opening-times-form.component.css",
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class OpeningTimesFormComponent {
  parentContainer = inject(ControlContainer);
  openingTimes: FormArray;
  openingTimesTemplate = OPENING_TIMES_TEMPLATE;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.openingTimes = new FormArray([]);
    this.openingTimesTemplate.forEach((day) => {
      const dayGroup = new FormGroup({
        day: new FormControl(day.day, []),
        start: new FormControl(day.start),
        end: new FormControl(day.end),
      });
      this.openingTimes.push(dayGroup);
    });
    this.parentFormGroup.addControl("openingTimes", this.openingTimes);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl("openingTimes");
  }
}
