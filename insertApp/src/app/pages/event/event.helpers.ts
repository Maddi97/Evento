import {FormControl} from '@angular/forms';
import {Event} from '../../models/event';
import {Address} from '../../models/organizer';
import * as moment from 'moment';

export function getEventFromForm(eventForm, organizer, category, times, updateEventId) {
    const event = new Event()
    const address = new Address()
    event._organizerId = organizer._id
    event.organizerName = organizer.name
    event.name = eventForm.get('name').value;
    address.plz = eventForm.get('plz').value;
    address.city = eventForm.get('city').value;
    const adressSplit = eventForm.get('street').value.split(' ')
    if (adressSplit[0] === '' && adressSplit.length === 2) {
        address.street = adressSplit[1]
        address.streetNumber = ''
    } else if (adressSplit.length === 1) {
        address.street = adressSplit[0]
        address.streetNumber = ''
    } else {
        address.street = adressSplit.slice(0, -1).join(' ');
        address.streetNumber = adressSplit.slice(-1)[0];
    }
    address.country = eventForm.get('country').value;

    event.address = address

    event.description = eventForm.get('description').value;
    event.link = eventForm.get('link').value;
    event.price = eventForm.get('price').value;
    event.permanent = eventForm.get('permanent').value;
    event.category = category;
    event.date = {
        start: moment(new Date()).utcOffset(0, true),
        end: moment(new Date()).utcOffset(0, true)
    }

    if (eventForm.get('permanent').value === 'false') {
        let start = eventForm.get('start').value
        start.setDate(start.getDate())

        start = moment(new Date(start.toISOString())).utcOffset(0, true).format();
        event.date.start = start

        let end = eventForm.get('end').value
        end.setDate(end.getDate())
        end = moment(new Date(end.toISOString())).utcOffset(0, true).format();
        event.date.end = end
    } else {
        event.date.start = moment(new Date()).utcOffset(0, true)
        event.date.end = moment(new Date()).utcOffset(0, true)
    }

    event.times = {start: times.start.value, end: times.end.value}
    event._id = updateEventId
    return event
}

export function getEventFormTemplate() {
    return {
        name: new FormControl('', []),
        city: new FormControl('Leipzig', []),
        plz: new FormControl('', []),
        street: new FormControl('', []),
        streetNumber: new FormControl('', []),
        country: new FormControl('Deutschland', []),
        description: new FormControl('', []),
        link: new FormControl('', []),
        price: new FormControl('', []),
        permanent: new FormControl('false', []),
        start: new FormControl('', []),
        end: new FormControl('', []),
        coord: new FormControl('', []),
    }
}