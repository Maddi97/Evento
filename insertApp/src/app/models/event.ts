import { Category } from './category'

export class Event {
    _id: string;
    name: string;
    _organizerId: string;
    organizerName: string;
    address: Address
    date: Date;
    times:{
        start: string,
        end: string
    }
    category: Category;
    description: string;
    link: string;
    price: string;
    geo_data:{
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

