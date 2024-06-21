import moment from "moment";
import { Address } from "../../../globals/models/address";
import { Event } from "../../../globals/models/event";
import { parse } from "path";
import { Category } from "@globals/models/category";
import { Organizer } from "@globals/models/organizer";

export type RausgegangenEvent = {
  name: string;
  startDateAndTime: string;
  endTime: string;
  organizerName: string;
  description: string;
  category: string;
  street: string;
  plzCity: string;
  link: string;
};

export function mapRausgegangenToEvents(
  events: RausgegangenEvent[],
  categories: Category[],
  organizers: Organizer[]
) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event, organizers);
  });
}
function mapPropertiesOfCrawledEvent(
  eventIn: RausgegangenEvent,
  organizers: Organizer[]
) {
  const e = new Event();
  e.name = eventIn.name;
  e.organizerName = eventIn.organizerName;
  e.description = eventIn.description;
  e.link = eventIn.link;
  e.category = mapRausgegangenCategory(eventIn.organizerName, organizers);
  e.address = parseAddress(eventIn.street, eventIn.plzCity);
  e.times = parseTime(eventIn.startDateAndTime, eventIn.endTime);
  e.date = parseDate(eventIn.startDateAndTime);
  e.permanent = false;
  return e;
}

function parseDate(datestr: string) {
  const date = datestr?.split(",")[1]?.trim() || undefined;
  if (!date) return { start: undefined, end: undefined };
  let momentDate = parseDateStr(date);
  return { start: momentDate, end: momentDate };
}
function parseTime(startStr: string, endStr: string) {
  const start =
    startStr
      ?.split(",")
      ?.pop()
      ?.replaceAll(" ", "")
      ?.replace("-", "")
      ?.replaceAll("\n", "") || undefined;
  if (!start) return { start: parseEndTime(endStr), end: undefined };
  else {
    return { start: start, end: parseEndTime(endStr) };
  }
}

function parseEndTime(timestr: string) {
  return timestr?.split(",").pop()?.trim() || undefined;
}
function mapRausgegangenCategory(
  organizerName: string,
  organizers: Organizer[]
) {
  const organizer = findOrganizerByName(organizerName, organizers);
  if (organizer) {
    return organizer.category;
  }
  return new Category();
}
function parseAddress(street: string, plzCity: string): Address {
  const address = new Address();
  address.street = street;
  const [plz, city] = plzCity?.split(" ") || ["", ""];
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
function findOrganizerByName(name, organizers): Organizer {
  return organizers
    .filter(
      (organizer) =>
        organizer.name?.toLowerCase() === name?.toLowerCase() ||
        organizer.alias?.some(
          (aliasName: string) => aliasName.toLowerCase() === name?.toLowerCase()
        )
    )
    .pop();
}
