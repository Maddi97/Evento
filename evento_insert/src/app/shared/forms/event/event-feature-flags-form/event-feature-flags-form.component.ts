import { Component, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: "app-event-feature-flags-form",
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatCheckbox],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./event-feature-flags-form.component.html",
  styleUrl: "./event-feature-flags-form.component.css",
})
export class EventFeatureFlagsFormComponent {
  parentContainer = inject(ControlContainer);
  eventFeatureFlagsForm = new FormGroup({
    hot: new FormControl(false, []),
    promotion: new FormControl(false, []),
  });
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    Object.keys(this.eventFeatureFlagsForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.addControl(
          formControlName,
          this.eventFeatureFlagsForm.controls[formControlName]
        );
      }
    );
  }

  ngOnDestroy() {
    Object.keys(this.eventFeatureFlagsForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.removeControl(formControlName);
      }
    );
  }
}
