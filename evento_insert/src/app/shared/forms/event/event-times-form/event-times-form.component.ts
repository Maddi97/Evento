import { Component, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

@Component({
  selector: "app-event-times-form",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./event-times-form.component.html",
  styleUrl: "./event-times-form.component.css",
})
export class EventTimesFormComponent {
  parentContainer = inject(ControlContainer);

  isEndTimeControl = new FormControl(true);

  eventTimesForm: FormGroup = new FormGroup({
    start: new FormControl("00:00"),
    end: new FormControl("00:00"),
  });

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl("times", this.eventTimesForm);
  }
  ngOnDestroy(): void {
    this.parentFormGroup.removeControl("times");
  }

  isEndChange() {
    if (this.isEndTimeControl.value) {
      this.eventTimesForm.get("end").enable();
    } else {
      this.eventTimesForm.get("end").disable();
    }
  }
}
