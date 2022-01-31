import {Category} from './category'
import {Day} from './organizer';
import * as moment from 'moment';

export class Event {
    _id: string;
    name: string;
    _organizerId: string;
    organizerName: string;
    address: Address
    date: {
        start: moment.Moment;
        end: moment.Moment;
    };
    times: {
        start: string,
        end: string
    }
    category: Category;
    openingTimes?: Day[];
    description: string;
    link: string;
    price: string;
    permanent: boolean;
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

