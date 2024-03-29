import { ID } from "./common.types";
import { PositionCoordsArray } from "./location.types";

export type FilterInputType = "Input";
export type FilterParamsType = "Params";
export type FilterEventType = FilterInputType | FilterParamsType;

export type FilterEventsByInput = {
  event: FilterInputType;
  searchString: string;
  limit: Number;
  alreadyReturnedEventIds: ID[];
  date: moment.Moment;
};

export type FilterEventsByParams = {
  event: FilterParamsType;
  date: moment.Moment;
  cat: ID[];
  subcat: ID[];
  limit: number;
  alreadyReturnedEventIds: ID[];
  currentPosition: PositionCoordsArray;
};

export type FilterEvents = FilterEventsByInput | FilterEventsByParams;
