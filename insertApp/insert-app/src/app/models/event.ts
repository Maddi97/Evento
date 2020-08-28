export class Event {
    _id: string;
    title: string;
    _organizerId: string;
    date: Date;
    openingTime: {
        start: string,
        end: string
    };
    category: string;
    description: string;
    price: string;
}
