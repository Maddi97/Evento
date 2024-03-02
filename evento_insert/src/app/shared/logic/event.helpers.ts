import { FormControl, Validators } from "@angular/forms";
import moment from "moment";
import { Event } from "@globals/models/event";

export function getEventFromForm(eventForm, updateEventId) {
  const event = new Event();
  Object.keys(eventForm.controls).forEach((key) => {
    event[key] = eventForm.controls[key].value;
  });
  event._id = updateEventId;
  return event;
}

export function getEventFormTemplate() {
  return {
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    city: new FormControl("Leipzig", []),
    plz: new FormControl("", []),
    street: new FormControl("", []),
    streetNumber: new FormControl("", []),
    country: new FormControl("Deutschland", []),
    description: new FormControl("", []),
    link: new FormControl("", []),
    price: new FormControl("", []),
    permanent: new FormControl("false", []),
    start: new FormControl("", [Validators.required]),
    end: new FormControl("", [Validators.required]),
    coord: new FormControl("", []),
  };
}

function formatDate(date) {
  // remove timezone and set time to 0
  date = moment(new Date(date))
    .utcOffset(0, true)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format();
  return date;
}
