import moment from "moment";
import { Event } from "@globals/models/event";
import { Category } from "@globals/models/category";

export type IFZEvent = {
  name: string;
  date: string;
  time: string;
  description: string;
  link: string;
  crawlerName: string;
};

export function mapIfzToEvents(events: IFZEvent[], categories: Category[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: IFZEvent) {
  const e = new Event();
  e._organizerId = undefined;
  e.address = {
    street: "An den Tierkliniken 38-40",
    city: "Leipzig",
    plz: "04103",
    country: "Deutschland",
  };
  e.name = eventIn.name;
  e.organizerName = "Institut für Zukunft";
  e.description = eventIn.description;
  e.link = eventIn.link;
  e.times.start = parseTime(eventIn.time);
  e.times.end = undefined;
  const date = { start: undefined, end: undefined };
  date.start = moment(parseDate(eventIn.date)).toISOString();
  date.end = moment(parseDate(eventIn.date)).toISOString();
  e.date = date;
  return e;
}

function parseDate(date: string): Date {
  let momentDate = moment(date, "DD.MM.");
  // Convert Moment.js object to a JavaScript Date object
  return momentDate.toDate();
}

function parseTime(time: string) {
  // Split the time string into hours and AM/PM
  if (!time) return;
  const [hoursStr, period] = time.split(" ");

  // Convert hours to 24-hour format
  const [hours, min] = hoursStr.split(":");
  let hoursInt = parseInt(hoursStr, 10);

  if (period.toLowerCase() === "pm" && hoursInt < 12) {
    hoursInt += 12;
  }
  // Format the hours and return the result
  return `${hoursInt.toString().padStart(2, "0")}:${min}`;
}
