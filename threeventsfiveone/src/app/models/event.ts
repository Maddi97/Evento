export class Event {
    _id: string;
    name: string;
    _organizerId: string;
    adress: Adress
    date: EventDate;
    category: string;
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

export class EventDate {
    day: string;
    start: string;
    end: string;
}