import {Category} from './category'


export class Organizer {
    _id: string;
    name: string;
    address: Address;
    email?: string;
    telephone?: string;
    category: Category;
    description: string;
    link: string;
    frequency: number;
    lastUpdated: Date;
    openingTimes?: Day[];
    isEvent: boolean;
    ifEventId: string;
    geoData: {
        lat: string,
        lon: string,
    };
}

export class Address {
    city: string;
    plz: string;
    street: string;
    streetNumber: string;
    country: string;
}

export class Day {
    day: string;
    start: string;
    end: string;
}