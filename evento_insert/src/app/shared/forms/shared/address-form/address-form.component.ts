import { CommonModule } from "@angular/common";
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
import { Address, AddressForm } from "src/app/globals/models/address";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-address-form",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./address-form.component.html",
  styleUrl: "./address-form.component.css",
})
export class AddressFormComponent {
  parentContainer = inject(ControlContainer);
  addressForm: FormGroup<AddressForm>;
  private initialAddress: Address = new Address();

  coordinatesForm: FormGroup;

  public isAddressViewForm: FormControl<boolean> = new FormControl(true);
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.addressForm = new FormGroup<AddressForm>({
      city: new FormControl(this.initialAddress.city, [Validators.required]), // Validator for required input
      plz: new FormControl(this.initialAddress.plz, [
        Validators.pattern("[0-9]{5}"),
      ]), // Validator for a pattern, in this case, a 5-digit number
      street: new FormControl(this.initialAddress.street, [
        Validators.required,
      ]),
      country: new FormControl(this.initialAddress.country, [
        Validators.required,
      ]),
    });
    this.coordinatesForm = new FormGroup({
      lat: new FormControl(null, []),
      lon: new FormControl(null, []),
    });
    this.parentFormGroup.addControl("address", this.addressForm);
    this.parentFormGroup.addControl("coordinates", this.coordinatesForm);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl("address");
  }
  changeAddressView() {
    if (!this.isAddressViewForm.value) {
      this.removeValidators(this.addressForm);
      this.addValidators("coordinatesForm", this.coordinatesForm);
    } else {
      this.addValidators("addressForm", this.addressForm);
      this.removeValidators(this.coordinatesForm);
    }
  }
  removeValidators(formGroup: FormGroup) {
    // Loop through each control in the form group
    Object.keys(formGroup.controls).forEach((key) => {
      // Get the control
      const control = formGroup.get(key);
      // Clear validators
      control.clearValidators();
      // Update value and validity
      control.updateValueAndValidity();
    });
  }
  addValidators(
    formGroupName: "addressForm" | "coordinatesForm",
    formGroup: FormGroup
  ) {
    if (formGroupName === "addressForm") {
      formGroup.get("city").setValidators([Validators.required]);
      formGroup.get("plz").setValidators([Validators.pattern("[0-9]{5}")]);
      formGroup.get("street").setValidators([Validators.required]);
      formGroup.get("country").setValidators([Validators.required]);
    } else if (formGroupName === "coordinatesForm") {
      formGroup.get("lat").setValidators([Validators.required]);
      formGroup.get("lon").setValidators([Validators.required]);
    }

    // Update value and validity after adding validators
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key).updateValueAndValidity();
    });
  }
}
