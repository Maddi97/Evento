import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";

@Component({
  selector: "app-organizer-additional-info-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./organizer-additional-info-form.component.html",
  styleUrl: "./organizer-additional-info-form.component.css",
})
export class OrganizerAdditionalInfoFormComponent implements OnInit {
  parentContainer = inject(ControlContainer);
  organizerAdditionalInfoForm = new FormGroup({
    email: new FormControl("", []),
    telephone: new FormControl("", []),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    link: new FormControl("", []),
    frequency: new FormControl(7, []),
    isEvent: new FormControl(false, []),
  });

  constructor() {}

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    //register all formControl singular in the parentForm
    Object.keys(this.organizerAdditionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.addControl(
          formControlName,
          this.organizerAdditionalInfoForm.controls[formControlName]
        );
      }
    );
  }

  ngOnDestroy() {
    Object.keys(this.organizerAdditionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.removeControl(formControlName);
      }
    );
  }
}
