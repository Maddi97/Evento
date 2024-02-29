import { Category } from "./category";
import { Day } from "../types/date.types";
import { Address, AddressForm } from "./address";
import { FormControl, FormGroup } from "@angular/forms";
import { Coordinates } from "@globals/types/location.types";

export class Organizer {
  _id: string; // Set to an empty string by default
  name: string = "";
  alias: string[];
  address: Address = new Address();
  email: string = "";
  telephone: string = "";
  category: Category = new Category(); // Replace 'BasicCategory' with the desired default value
  description: string = "";
  link: string = "";
  frequency: number = 0; // Set to 0 by default
  lastUpdated: Date = new Date();
  openingTimes: Day[] = [];
  isEvent: boolean = false; // Set to false by default
  ifEventId: string = "";
  geoData: Coordinates = { lat: "", lon: "" };
  organizerImageTemporaryURL: string;
  organizerImagePath: string;
}

export interface IOrganizerForm {
  name: FormControl<string>;
  alias: FormControl<string[]>;
  address: FormGroup<AddressForm>;
  email: FormControl<string>;
  telephone: FormControl<string>;
  category: FormControl<Category>;
  description: FormControl<string>;
  link: FormControl<string>;
  frequency: FormControl<number>;
  lastUpdated: FormControl<Date>;
  openingTimes: FormControl<Day[]>;
  isEvent: FormControl<boolean>;
  ifEventId: FormControl<string>;
  geoData: FormControl<{ lat: string; lon: string }>;
  organizerImageTemporaryURL: FormControl<string>;
  organizerImagePath: FormControl<string>;
  isOrganizerAlias: FormControl<boolean>;
}
