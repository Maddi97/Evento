import moment from "moment";
import { Category } from "./category";
import { Day } from "../types/date.types";
import { Address } from "./address";

export class Event {
  _id: string;
  name: string = "";
  _organizerId: string;
  organizerName: string;
  address: Address = new Address();
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  times: {
    start: string;
    end: string;
  } = {
    start: "",
    end: "",
  };
  category: Category;
  openingTimes?: Day[];
  description: string;
  link: string = "";
  price: string = "";
  permanent: boolean = false;
  hasUnkownOpeningTimes: boolean;
  hot: boolean = false;
  promotion: boolean;
  geoData: {
    lat: string;
    lon: string;
  } = {
    lat: "",
    lon: "",
  };
  eventImageTemporaryURL: string;
  eventImagePath: string;
  frequency;
}
