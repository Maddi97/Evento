import { Category } from './category';
export class Event {
    _id: string;
    name: string;
    _organizerId: string;
    adress: Adress
    date: Date;
    times: EventTimes;
    category: Category;
    description: string;
    price: string;
}

export class Adress {
    city: string;
    plz: string;
    street: string;
    streetNumber: string;
    country: string;
}

export class EventTimes {
    start: string;
    end: string;
}
