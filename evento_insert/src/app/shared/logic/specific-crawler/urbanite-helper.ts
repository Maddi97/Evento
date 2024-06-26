import moment from "moment";
import { Event } from "@globals/models/event";
import { Address } from "@globals/models/address";
import { Category } from "@globals/models/category";

export type UrbaniteEvent = {
  date: string;
  start_time: string;
  end_time: string;
  category: string;
  subcategory: string;
  event_name: string;
  organizer_name: string;
  street: string;
  city: string;
  plz: string;
  description: string;
  link: string;
};

const mapCategoriesUrbanite = {
  "MESSEN + KONGRESSE": { c: "Sonstiges", s: undefined },
  "Kinder + Familie": { c: "Sonstiges", s: undefined },
  "ESSEN + TRINKEN": { c: "Sonstiges", s: undefined },
  "SPECIAL EVENTS": { c: "Sonstiges", s: undefined },
  FÜHRUNGEN: { c: "Sonstiges", s: undefined },
  STADTLEBEN: { c: "Sonstiges", s: undefined },
  AUSSTELLUNG: { c: "Kunst & Museum", s: "Austellung" },
  SPORT: { c: "Sport - Live", s: undefined },
  BÜHNE: { c: "Kultur", s: undefined },
  PARTY: { c: "Club", s: undefined },
  "KONZERTE + LIVEMUSIK": { c: "Konzerte & Livemusik", s: undefined },
};

const mapSubcategoriesUrbanite = {
  "Comedy & Kabarett": { c: "Comedy", s: undefined },
  Techno: { c: "Techno", s: undefined },
};

export function mapUrbaniteToEvents(
  events: UrbaniteEvent[],
  categories: Category[]
) {
  return events.map((event) => {
    return mapPropertiesOfCrawledEvent(event, categories);
  });
}
function mapPropertiesOfCrawledEvent(
  eventIn: UrbaniteEvent,
  categories: Category[]
): Event {
  const e = new Event();
  e.name = eventIn.event_name;
  e.organizerName = eventIn.organizer_name;
  e.category = mapCategory(eventIn.category, eventIn.subcategory, categories);
  const address = {
    city: eventIn.city,
    plz: eventIn.plz,
    street: eventIn.street,
    country: "Deutschland",
  };
  e.address = createAddressFromInput(address);
  e.description = eventIn.description;
  e.link = eventIn.link;
  if (eventIn.start_time === "ganztägig") {
    e.times.start = "00:00";
    e.times.end = "00:00";
  } else {
    e.times.start = parseTimeFormat(eventIn.start_time);
    e.times.end = parseTimeFormat(eventIn.end_time);
  }
  const date = { start: undefined, end: undefined };
  if (eventIn.date) {
    date.start = moment(
      new Date(parseEventDateUrbanite(eventIn.date))
    ).toISOString();
    date.end = date.start;
  }

  e.date = date;
  e.permanent = false;
  return e;
}

function mapCategory(
  category: string,
  subcategory: string,
  categories: Category[]
) {
  const mappedCategory = mapSubcategoriesUrbanite[subcategory]
    ? mapSubcategoriesUrbanite[subcategory]
    : mapCategoriesUrbanite[category];
  let categoryObj = categories.find((c) => c.name === mappedCategory?.c);
  if (!categoryObj) return new Category();
  categoryObj.subcategories =
    categoryObj?.subcategories.filter((s) => s.name === mappedCategory?.s) ||
    [];
  return categoryObj;
}

function createAddressFromInput(address: any): Address {
  const a = new Address();
  a.city = address.city;
  a.plz = address.plz;
  //divide street and street number from street input
  a.street = address.street || "";
  a.country = address.country;
  return a;
}

function parseEventDateUrbanite(dateString: string): Date | null {
  // Split the input string into parts
  let date = dateString?.split(" ")[1];
  // parse the date string whicch is in german time format to a date object
  let momentDate = moment(date, "DD.MM.YYYY");
  // Convert Moment.js object to a JavaScript Date object
  return date ? momentDate.toDate() : null;
}

function parseTimeFormat(time: string) {
  const match = time?.match(/\b\d{2}:\d{2}\b/);
  return match ? match[0] : undefined;
}
