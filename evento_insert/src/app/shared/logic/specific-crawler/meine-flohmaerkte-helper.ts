import { Event } from "../../../globals/models/event";
import moment from "moment";

export type MeineFlohmaerkteEvent = {
  name: string;
  timeAndDate: string;
  description: string;
  address: string;
  organizerName: string;
  link: string;
  crawlerName: string;
};
export function mapMeineFlohmaerkteToEvents(events: MeineFlohmaerkteEvent[]) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}

function mapPropertiesOfCrawledEvent(eventIn: MeineFlohmaerkteEvent) {
  const e = new Event();

  e.name = eventIn.name;
  e.organizerName = eventIn.organizerName;
  e.description = eventIn.description;
  e.link = eventIn.link;
  e.address = parseAdress(eventIn.address);
  e.times = parseTime(eventIn.timeAndDate);
  e.date = parseDate(eventIn.timeAndDate);
  return e;
}

function parseAdress(adress: string) {
  const [street, cityPlz, state] = adress.split("\n");
  const [plz, city] = cityPlz.split(" ");
  return {
    street: street,
    city: city,
    plz: plz,
    country: "Deutschland",
  };
}

function parseTime(timeAndDate: string) {
  const [day, date, startTime, _, endTime] = timeAndDate.split(" ");
  return { start: startTime, end: endTime };
}

function parseDate(timeAndDate: string) {
  const [day, date, startTime, _, endTime] = timeAndDate.split(" ");
  let momentDate = moment(date, "DD.MM.YYYY");
  const eventDate = momentDate.toISOString();
  return { start: eventDate, end: eventDate };
}
