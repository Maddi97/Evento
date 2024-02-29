import { FormGroup } from "@angular/forms";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import moment from "moment";

export function transformFormFieldToOrganizer(
  organizerForm: FormGroup,
  organizerId
) {
  const org = new Organizer();
  Object.keys(organizerForm.controls).forEach((key) => {
    org[key] = organizerForm.controls[key].value;
  });

  if (organizerId) org._id = organizerId;

  org.lastUpdated = new Date();
  return org;
}

export function createEventFromOrg(org) {
  const event = new Event();
  const date = {
    start: moment(new Date()).utcOffset(0, false),
    end: moment(new Date()).utcOffset(0, false),
  };
  const times = { start: "00:00", end: "00:00" };
  event.name = org.name;
  event.description = org.description;
  event.address = org.address;
  event.category = org.category;
  event.organizerName = org.name;
  event.permanent = true;
  event.openingTimes = org.openingTimes;
  event.times = times;
  event.link = org.link;
  event.geoData = org.geoData;
  event.date = date;
  event.price = "";
  event.hasUnkownOpeningTimes = true;
  return event;
}
