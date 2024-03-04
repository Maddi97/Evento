import { CoordinatesObject } from "@globals/types/location.types";
import { Category } from "./category";

export class Organizer {
  _id: string;
  name: string;
  address: Address;
  email?: string;
  telephone?: string;
  category: Category;
  description: string;
  openingTimes?: Day[];
  coordinates?: CoordinatesObject;
  organizerImageTemporaryURL: string;
  organizerImagePath: string;
}

export class Address {
  city: string;
  plz: string;
  street: string;
  country: string;
}

export class Day {
  day: string;
  start: string;
  end: string;
}
