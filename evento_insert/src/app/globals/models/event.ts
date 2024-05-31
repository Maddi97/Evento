import moment from "moment";
import { Category } from "./category";
import { DayWithTimes, Frequency } from "../types/date.types";
import { Address } from "./address";
import { CoordinatesObject } from "@globals/types/location.types";

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
    start: "00:00",
    end: "00:00",
  };
  category: Category = new Category();
  openingTimes?: DayWithTimes[];
  description: string;
  link: string = "";
  price: string = "";
  permanent: boolean = false;
  hasUnkownOpeningTimes: boolean;
  hot: boolean = false;
  promotion: boolean;
  coordinates: CoordinatesObject = {
    lat: "",
    lon: "",
  };
  eventImageTemporaryURL: string;
  eventImagePath: string;
  frequency: Frequency;
}
