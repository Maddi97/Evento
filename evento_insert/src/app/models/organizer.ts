import { Category } from './category';


export class Organizer {
    _id: string; // Set to an empty string by default
    name: string = '';
    alias: string[];
    address: Address = new Address();
    email: string = '';
    telephone: string = '';
    category: Category = new Category(); // Replace 'BasicCategory' with the desired default value
    description: string = '';
    link: string = '';
    frequency: number = 0; // Set to 0 by default
    lastUpdated: Date = new Date();
    openingTimes: Day[] = [];
    isEvent: boolean = false; // Set to false by default
    ifEventId: string = '';
    geoData: { lat: string, lon: string } = { lat: '', lon: '' };
    organizerImageTemporaryURL: string;
    organizerImagePath: string;
}

export class Address {
    city: string = 'Leipzig';
    plz: string = '04109';
    street: string = '';
    streetNumber: string = '';
    country: string = 'Deutschland';
}

export class Day {
    day: string;
    start: string;
    end: string;
}