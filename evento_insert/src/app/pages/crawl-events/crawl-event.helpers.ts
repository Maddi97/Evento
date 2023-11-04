import * as moment from 'moment';
import { Event } from '../../models/event';
export type Crawler = 'urbanite';
export function createEventForSpecificCrawler(crawlerName: Crawler, event, organizer): Event {
    switch (crawlerName) {
        case 'urbanite':
            return createEventUrbanite(event, organizer)
    }
}

function createEventUrbanite(event, organizer) {
    const e = new Event();
    e._organizerId = organizer._id
    e.name = event.name
    e.organizerName = organizer.name
    e.address = organizer.address
    e.category = organizer.category
    e.description = organizer.description
    // TODO assign correct values
    e.times.start = event.times.start
    const date = { start: undefined, end: undefined }
    date.start = moment(new Date(parseEventDate(event.date.start)))
    e.date = date
    e.permanent = false;
    return e
}
function parseEventDate(dateString: string): Date | null {
    const months: { [key: string]: number } = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
    };

    // Split the input string into parts
    const parts = dateString.split(".\n");

    if (parts.length !== 2) {
        // Invalid format
        return null;
    }

    const day = parseInt(parts[0], 10);
    const monthAbbreviation = parts[1];

    if (isNaN(day) || !months[monthAbbreviation]) {
        // Invalid day or month
        return null;
    }

    const year = new Date().getFullYear(); // You can set a specific year here
    const eventDate = new Date(year, months[monthAbbreviation], day);

    if (isNaN(eventDate.getTime())) {
        // Invalid date
        return null;
    }
    return eventDate;
}