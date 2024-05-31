import { FormControl } from "@angular/forms";

export class Address {
  city: string = "Leipzig";
  plz: string = "04109";
  street: string = "";
  country: string = "Deutschland";
}

export interface AddressForm {
  city: FormControl<string | null>;
  plz: FormControl<string>;
  street: FormControl<string>;
  country: FormControl<string>;
}
