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
      lat: new FormControl("", [Validators.required]),
      lon: new FormControl("", [Validators.required]),
    });
    this.parentFormGroup.addControl("address", this.addressForm);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl("address");
  }

  changeAddressView() {
    if (this.isAddressViewForm.value) {
      this.parentFormGroup.removeControl("coordinates");
      this.parentFormGroup.addControl("address", this.addressForm);
    } else {
      this.parentFormGroup.removeControl("address");
      this.parentFormGroup.addControl("coordinates", this.coordinatesForm);
    }
  }
}
