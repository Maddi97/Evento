import * as moment from "moment";
import { Event } from "../../../models/event";

export type IFZEvent = {
  name: string;	
  date: string;	
  time: string;	
  description: string;
  link: string;
  crawlerName: string;
};

export function mapIfzToEvents(events: IFZEvent[]) {
  return events
   .map((event) => {
    return mapPropertiesOfCrawledEvent(event);
  });
}
function mapPropertiesOfCrawledEvent(eventIn: IFZEvent) {
    console.log("hallo", eventIn.link)
  return {
    name: eventIn.name,
    date: parseDate(eventIn.date),
    time: parseTime(eventIn.time),
    organizerName: 'Institut für Zukunft',
    description: eventIn.description,
    link: eventIn.link,
    crawlerName: eventIn.crawlerName,

  }
}


export function createEventIfz(event, organizer) {
  const e = new Event();
  e._organizerId = organizer._id;
  e.name = event.name;
  e.organizerName = organizer.name;
  e.address = organizer.address;
  e.category = organizer.category;
  e.description = event.description;
  e.link = event.link;
  e.times = {
    start: event.time,
    end: '9:00'
  }
  e.date = {
    start: event.date,
    end: moment(event.date).add(1, 'days')
  }
  return e;
}

function parseDate(date: string): Date {
    let momentDate = moment(date, "DD.MM.");
    // Convert Moment.js object to a JavaScript Date object
    return momentDate.toDate(); 
}

function parseTime(time: string) {
    const timeObject = new Date("2000-01-01 " + time);

    // Format the time object in 24-hour format
    const time24hFormat = timeObject.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    return time24hFormat;
}
