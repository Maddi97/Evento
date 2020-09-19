import { Category } from './category'

export class Event {
    _id: string;
    name: string;
    _organizerId: string;
    adress: Adress
    date: Date;
    times:{
        start: string,
        end: string
    }
    category: Category;
    description: string;
    link: string;
    price: string;
}

export class Adress {
    city: string;
    plz: string;
    street: string;
    streetNumber: string;
    country: string;
}

