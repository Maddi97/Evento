import moment from "moment";
import { Address } from "../../../globals/models/address";
import { Event } from "../../../globals/models/event";
import { parse } from "path";

export type RausgegangenEvent = {
  name: string;
  startDateAndTime: string;
  endTime: string;
  organizerName: string;
  description: string;
  street: string;
  plzCity: string;
  link: string;
};

export function mapRausgegangenToEvents(events: RausgegangenEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: RausgegangenEvent) {
  const e = new Event();
  e.name = eventIn.name;
  e.organizerName = eventIn.organizerName;
  e.description = eventIn.description;
  e.link = eventIn.link;
  e.address = parseAddress(eventIn.street, eventIn.plzCity);
  e.times = parseTime(eventIn.startDateAndTime, eventIn.endTime);
  e.date = parseDate(eventIn.startDateAndTime);
  e.permanent = false;
  return e;
}

function parseDate(datestr: string) {
  const date = datestr.split(",")[1]?.trim();
  let momentDate = parseDateStr(date);
  return { start: momentDate, end: momentDate };
}
function parseTime(startStr: string, endStr: string) {
  const start =
    startStr
      .split(",")
      .pop()
      .replaceAll(" ", "")
      .replace("-", "")
      .replaceAll("\n", "") || undefined;
  if (!start) return { start: parseEndTime(endStr), end: undefined };
  else {
    return { start: start, end: parseEndTime(endStr) };
  }
}

function parseEndTime(timestr: string) {
  return timestr.split(",").pop()?.trim() || undefined;
}

function parseAddress(street: string, plzCity: string): Address {
  const address = new Address();
  address.street = street;
  const [plz, city] = plzCity.split(" ");
  address.city = city;
  address.plz = plz;
  return address;
}

function parseDateStr(datestr: string) {
  const [day, monthStr, year] = datestr.split(" ");
  // Create an object to map month abbreviations to their numeric equivalents
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // Format the date into YYYY-MM-DD format
  const formattedDate = `${year}-${months[monthStr]}-${day}`;

  // Parse the date string to a Date object
  const parsedDate = new Date(formattedDate);
  return moment(parsedDate).toISOString();
}
