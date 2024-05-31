import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
  ControlContainer,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-event-additional-information-form",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./event-additional-information-form.component.html",
  styleUrl: "./event-additional-information-form.component.css",
})
export class EventAdditionalInformationFormComponent implements OnInit {
  parentContainer = inject(ControlContainer);
  eventAdditionalInfoForm = new FormGroup({
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    link: new FormControl("", []),
    price: new FormControl(undefined, []),
  });

  constructor() {}

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    //register all formControl singular in the parentForm
    Object.keys(this.eventAdditionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.addControl(
          formControlName,
          this.eventAdditionalInfoForm.controls[formControlName]
        );
      }
    );
  }

  ngOnDestroy() {
    Object.keys(this.eventAdditionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.removeControl(formControlName);
      }
    );
  }
}
