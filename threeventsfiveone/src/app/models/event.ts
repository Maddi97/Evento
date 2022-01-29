import {Category} from './category'
import {Day} from "./organizer";

export class Event {
  _id: string;
  name: string;
  _organizerId: string;
  organizerName: string;
  address: Address;
  date: {
    start: Date,
    end: Date,
  };
  times: {
    start: string,
    end: string
  };
  openingTimes?: Day[];

  category: Category;
  description: string;
  link: string;
  price: string;
  geoData: {
    lat: string,
    lon: string,
  };
}

export class Address {
  city: string;
  plz: string;
  street: string;
  streetNumber: string;
  country: string;
}

