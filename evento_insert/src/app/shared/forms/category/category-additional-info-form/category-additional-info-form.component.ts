import { Component, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-category-additional-info-form",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./category-additional-info-form.component.html",
  styleUrl: "./category-additional-info-form.component.css",
})
export class CategoryAdditionalInfoFormComponent {
  parentContainer = inject(ControlContainer);
  additionalInfoForm = new FormGroup({
    weight: new FormControl("", [Validators.min(0), Validators.max(100)]),
  });
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    //register all formControl singular in the parentForm
    Object.keys(this.additionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.addControl(
          formControlName,
          this.additionalInfoForm.controls[formControlName]
        );
      }
    );
  }
  ngOnDestroy() {
    Object.keys(this.additionalInfoForm.controls).forEach(
      (formControlName: string) => {
        this.parentFormGroup.removeControl(formControlName);
      }
    );
  }
}
