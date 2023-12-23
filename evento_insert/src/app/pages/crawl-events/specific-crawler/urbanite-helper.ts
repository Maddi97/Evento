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
};

export function mapUrbaniteToEvents(events: UrbaniteEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: UrbaniteEvent) {
  return {
    date: { start: eventIn.date },
    times: { start: eventIn.start_time },
    category: eventIn.category,
    name: eventIn.event_name,
    organizerName: eventIn.organizer_name,
    description: eventIn.description,
    address: {
    city: eventIn.city,
    plz: eventIn.plz,
    street: eventIn.street,
    country: 'Deutschland'
}}
  };


export function createEventUrbanite(event, organizer) {
  const e = new Event();
  const address = createAddressFromInput(event.address);

  e._organizerId = organizer._id;
  e.name = event.name;
  e.organizerName = organizer.name;
  e.address = address;
  e.category = organizer.category;
  e.description = event.description;

  // TODO assign correct values
  if (event.times.start === "ganztägig") {
    e.times.start = "00:00";
    e.times.end = "00:00";
  } else {
    e.times.start = event.times.start;
    e.times.end = endTimeUrbanite(event.times.start);
  }
  const date = { start: undefined, end: undefined };
  date.start = moment(new Date(parseEventDateUrbanite(event.date.start)));
  date.end = endDateUrbanite(date.start, event.times.start);
  e.date = date;

  e.permanent = false;
  return e;
}

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
