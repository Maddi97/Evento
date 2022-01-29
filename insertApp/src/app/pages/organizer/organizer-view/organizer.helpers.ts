import {FormControl} from '@angular/forms';
import {Address, Day, Organizer} from '../../../models/organizer';
import {Event} from '../../../models/event';


export function getOrganizerFormTemplate() {
// return organizer Form
    return {
        name: new FormControl('', []),
        city: new FormControl('Leipzig', []),
        plz: new FormControl('', []),
        street: new FormControl('', []),
        streetNumber: new FormControl('', []),
        country: new FormControl('Deutschland', []),
        email: new FormControl('', []),
        telephone: new FormControl('', []),
        description: new FormControl('', []),
        link: new FormControl('', []),
        frequency: new FormControl(7, []),
        isEvent: new FormControl('false', [])
    }
}

export function getOpeningTimesTemplate() {
    const openingTimes: Day[] = [
        {day: 'Monday', start: '00:00', end: '00:00'},
        {day: 'Tuesday', start: '00:00', end: '00:00'},
        {day: 'Wednesday', start: '00:00', end: '00:00'},
        {day: 'Thursday', start: '00:00', end: '00:00'},
        {day: 'Friday', start: '00:00', end: '00:00'},
        {day: 'Saturday', start: '00:00', end: '00:00'},
        {day: 'Sunday', start: '00:00', end: '00:00'}
    ]
    return openingTimes
}

export function getGeoDataTemplate() {
    return {
        lat: '',
        lon: ''
    }
}

export function transformFormFieldToOrganizer(organizerForm, category, openingTimes, geoData, organizerId) {
    const org = new Organizer()
    org.name = organizerForm.get('name').value;

    if (!(organizerId === '')) org._id = organizerId
    org.address = createAdressObject(organizerForm)

    org.email = organizerForm.get('email').value;
    org.telephone = organizerForm.get('telephone').value;
    org.description = organizerForm.get('description').value;
    org.link = organizerForm.get('link').value;
    org.frequency = organizerForm.get('frequency').value;
    org.isEvent = organizerForm.get('isEvent').value;
    org.category = category;
    org.openingTimes = openingTimes
    org.lastUpdated = new Date()

    org.geoData = geoData

    return org

}

function createAdressObject(organizerForm) {
    const address = new Address()
    address.plz = organizerForm.get('plz').value;
    address.city = organizerForm.get('city').value;

    const adressSplit = organizerForm.get('street').value.split(' ')

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
    address.country = organizerForm.get('country').value;


    return address
}

export function createEventFromOrg(org) {
    const event = new Event()

    event.name = org.name
    event.description = org.description
    event.address = org.address
    event.category = org.category
    event.organizerName = org.name
    event.permanent = true
    event.openingTimes = org.openingTimes
    event.link = org.link
    event.geoData = org.geoData
    return event
}
