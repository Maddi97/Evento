import { Category } from "./category";
import { Day } from "./organizer";

export class Event {
  _id: string;
  name: string;
  _organizerId: string;
  organizerName: string;
  address: Address;
  date: {
    start: Date;
    end: Date;
  };
  frequency;
  permanent: boolean;
  hasUnkownOpeningTimes: boolean;
  times: {
    start: string;
    end: string;
  };
  openingTimes?: Day[];

  category: Category;
  description: string;
  link: string;
  price: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  hot: boolean;
  promotion: boolean;
  eventImageTemporaryURL: string;
  eventImagePath: string;
}

export class Address {
  city: string;
  plz: string;
  street: string;
  country: string;
}
