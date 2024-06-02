import moment from "moment";
import { Address } from "@globals/models/address";
import { Event } from "@globals/models/event";

export type LeipzigEvent = {
  name: string;
  date: string;
  time: string;
  organizerName: string;
  description: string;
  price: string;
  address: string;
  phone: string;
  link: string;
};

export function mapLeipzigToEvents(events: LeipzigEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: LeipzigEvent) {
  return {
    date: { start: eventIn.date },
    name: eventIn.name,
    organizerName: parseOrganizerName(eventIn.organizerName),
    description: eventIn.description,
    address: parseAddress(eventIn.address),
    link: eventIn.link,
  };
}

export function createEventLeipzig(event, organizer) {
  const e = new Event();
  e._organizerId = organizer._id;
  e.name = event.name;
  e.organizerName = organizer.name;
  e.address = event.address;
  e.category = organizer.category;
  e.description = event.description;

  // TODO assign correct values
  if (event.times.start === "ganztägig") {
    e.times.start = "00:00";
    e.times.end = "00:00";
  } else {
    e.times.start = event.times.start;
    e.times.end = endTimeLeipzig(event.times.start);
  }
  const date = { start: undefined, end: undefined };
  if (event.date.start) {
    date.start = moment(new Date(parseEventDateLeipzig(event.date.start)));
    date.end = endDateLeipzig(date.start);
  }
  e.date = date;

  e.permanent = false;
  return e;
}

function endTimeLeipzig(start: any): string {
  throw new Error("Function not implemented.");
}

function parseEventDateLeipzig(start: any): string | number | Date {
  throw new Error("Function not implemented.");
}
function endDateLeipzig(start: any): string | number | Date {
  throw new Error("Function not implemented.");
}

function parseOrganizerName(name: string): string {
  let substringsToReplace = ["Veranstaltungsort", "\n"];
  let regex = new RegExp(substringsToReplace.join("|"), "g");

  const oName = name.replace(regex, "");
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
