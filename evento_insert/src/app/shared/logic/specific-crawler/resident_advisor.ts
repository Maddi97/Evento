import moment from "moment";
import { Address } from "../../../globals/models/address";
import { Event } from "../../../globals/models/event";

export type RAEvent = {
  name: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  organizerName: string;
  description: string;
  address: string;
  link: string;
};

export function mapLeipzigToEvents(events: RAEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: RAEvent) {
  const e = new Event();
  e.name = eventIn.name;
  e.organizerName = parseOrganizerName(eventIn.organizerName);
  e.description = eventIn.description;
  e.link = eventIn.link;
  e.address = parseAddress(eventIn.address);
  type Times = { start: string | undefined; end: string | undefined };
  const times: Times = { start: undefined, end: undefined };
  e.times.start = eventIn.timeStart;
  e.times.end = eventIn.timeEnd;
  e.date = parseDate(eventIn.date);
  e.permanent = false;
  return e;
}

function parseDate(dateStr: string) {
  const date = extractImportantString(dateStr, "Datum");
  let momentDate = moment(date, "DD.MM.YYYY");
  const eventDate = momentDate.toISOString();
  return { start: eventDate, end: eventDate };
}

function parseOrganizerName(name: string): string {
  const oName = extractImportantString(name, "Veranstaltungsort");
  return oName;
}
function parseAddress(address: string): Address {
  // Define regular expressions for city, PLZ, and street with street number
  const cityRegex = /([^0-9]+)/;
  const plzRegex = /(\d{5})/;
  const streetWithNumberRegex = /([^0-9]+)(\d+)?/;

  // Combine the regular expressions
  const fullRegex = new RegExp(
    `${streetWithNumberRegex.source}\n${plzRegex.source} ${cityRegex.source}`
  );

  // Execute the regular expression
  const match = address.match(fullRegex);

  // Initialize an array to store parsed information
  const a = new Address();
  // Check if the match is found
  if (match) {
    const streetNumber = match[2] || "";
    a.street = match[1].trim() + " " + streetNumber;
    a.plz = match[3].trim();
    a.city = match[4].trim();
  }
  // Return the array of parsed information
  return a;
}

function extractImportantString(str: string, key: string) {
  let substringsToReplace = [key, "\n"];
  let regex = new RegExp(substringsToReplace.join("|"), "g");

  return str.replace(regex, "");
}
