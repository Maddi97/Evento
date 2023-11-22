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
    if (event.times.start === 'ganztägig') {
        e.times.start = '00:00'
        e.times.end = '00:00'
    }
    else {
        e.times.start = event.times.start
        e.times.end = endTimeUrbanite(event.times.start)
    }
    const date = { start: undefined, end: undefined }
    date.start = moment(new Date(parseEventDateUrbanite(event.date.start)))
    date.end = endDateUrbanite(date.start, event.times.start)
    e.date = date

    e.permanent = false;
    return e
}

function endTimeUrbanite(startTime: string) {
    const startHour = Number(startTime.split(':')[0])
    const endTimeHour = startHour >= 20 ? '04:00' : '00:00'
    return endTimeHour
}

function endDateUrbanite(startDate, startTime) {
    const startHour = Number(startTime.split(':')[0])
    //if event is longer than midnight add one day
    let endDate = moment(startDate);
    endDate = startHour >= 20 ? endDate.add(1, 'days') : endDate
    return endDate;
}

function parseEventDateUrbanite(dateString: string): Date | null {
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