import * as moment from "moment";
import { Address, Event } from "../../../models/event";

export type UrbaniteEvent = {
  date: string;
  start_time: string;
  category: string;
  event_name: string;
  organizer_name: string;
  street: string;
  city: string;
  plz: string;
  description: string;
  link: string;
  crawlerName: string;
};

export function mapUrbaniteToEvents(events: UrbaniteEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: UrbaniteEvent): Event {
  const e = new Event();
  e.organizerName = eventIn.organizer_name

  const address = {
    city: eventIn.city,
    plz: eventIn.plz,
    street: eventIn.street,
    country: 'Deutschland',
    };
  e.address = createAddressFromInput(address);
  e.description = eventIn.description;
  e.link = eventIn.link;
if (eventIn.start_time === "ganztägig") {
    e.times.start = "00:00";
    e.times.end = "00:00";
  } else {
    e.times.start = eventIn.start_time;
    e.times.end = endTimeUrbanite(eventIn.start_time);
  }
  const date = { start: undefined, end: undefined };
  date.start = moment(new Date(parseEventDateUrbanite(eventIn.date)));
  date.end = endDateUrbanite(date.start, eventIn.start_time);
  e.date = date;

  e.permanent = false;
  return e;

  };

function createAddressFromInput(address: any): Address {
  const a = new Address();
  a.city = address.city;
  a.plz = address.plz;
  //divide street and street number from street input
  a.street = address.street.split(" ")[0];
  a.streetNumber = address.street.split(" ")[1] || '';
  a.country = address.country;
  return a;
}

function endTimeUrbanite(startTime: string) {
  const startHour = Number(startTime.split(":")[0]);
  const endTimeHour = startHour >= 20 ? "04:00" : "00:00";
  return endTimeHour;
}

function endDateUrbanite(startDate, startTime) {
  const startHour = Number(startTime.split(":")[0]);
  //if event is longer than midnight add one day
  let endDate = moment(startDate);
  endDate = startHour >= 20 ? endDate.add(1, "days") : endDate;
  return endDate;
}

function parseEventDateUrbanite(dateString: string): Date | null {
  // Split the input string into parts
  let date = dateString.split(" ")[1];
  // parse the date string whicch is in german time format to a date object
let momentDate = moment(date, "DD.MM.YYYY");
// Convert Moment.js object to a JavaScript Date object
return momentDate.toDate(); 
 }
