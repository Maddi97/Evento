import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";
import { Organizer } from "../../../globals/models/organizer";
import { createEventFromOrg } from "../../logic/organizer.helpers";
import { EventsService } from "../events/events.web.service";
import { FileUploadService } from "../files/file-upload.service";
import { NominatimGeoService } from "../location/nominatim-geo.service";
import { OrganizerService } from "./organizer.web.service";

@Injectable({
  providedIn: "root",
})
export class OrganizerObservableService {
  organizerImagePath = "images/organizerImages/";

  constructor(
    private geoService: NominatimGeoService,
    private eventService: EventsService,
    private fileService: FileUploadService,
    private organizerService: OrganizerService,
    public dialog: MatDialog
  ) {}

  addNewOrganizer(organizer): Promise<Organizer> {
    return new Promise(async (resolve, reject) => {
      try {
        const org = organizer;
        const address = org.address;

        const geoData = await this.geoService.getCoordinates(
          address.city,
          address.street
        );
        org.geoData = geoData;

        const createOrganizerResponse = await lastValueFrom(
          this.organizerService.createOrganizer(org)
        );
        const _id = createOrganizerResponse._id;
        org._id = createOrganizerResponse._id;

        const formdata = org.fd;
        delete org.fd;

        if (formdata !== undefined) {
          const fullOrganizerImagePath =
            this.organizerImagePath + createOrganizerResponse._id;
          formdata.append("organizerImagePath", fullOrganizerImagePath);
          const uploadImageResponse = await lastValueFrom(
            this.fileService.uploadOrganizerImage(formdata)
          );
          org.organizerImagePath = uploadImageResponse.organizerImage.path;
          await lastValueFrom(this.organizerService.updateOrganizer(_id, org));
        }

        if (createOrganizerResponse.isEvent === true) {
          const event = createEventFromOrg(org);
          event._organizerId = _id;
          const eventResponse = await lastValueFrom(
            this.eventService.createEvent(event)
          );
          org.ifEventId = eventResponse._id;
          await lastValueFrom(this.organizerService.updateOrganizer(_id, org));
        }
        resolve(createOrganizerResponse);
      } catch (error) {
        console.error("An error occurred", error);
        reject(error);
      }
    });
  }

  updateOrganizer(organizer): Promise<Organizer> {
    return new Promise(async (resolve, reject) => {
      try {
        const org = organizer;
        const address = org.address;
        org._id = organizer._id;

        org.geoData = await this.geoService.getCoordinates(
          address.city,
          address.street
        );
        const updateOrganizerResponse = await lastValueFrom(
          this.organizerService.updateOrganizer(org._id, org)
        );
        const _id = updateOrganizerResponse._id;

        const formdata = org.fd;
        delete org.fd;

        if (formdata !== undefined) {
          const fullOrganizerImagePath =
            this.organizerImagePath + updateOrganizerResponse._id;
          formdata.append("organizerImagePath", fullOrganizerImagePath);
          const uploadImageResponse = await lastValueFrom(
            this.fileService.uploadOrganizerImage(formdata)
          );
          org.organizerImagePath = uploadImageResponse.organizerImage.path;
          await lastValueFrom(this.organizerService.updateOrganizer(_id, org));
        }

        if (
          org.isEvent.toString() === "true" &&
          updateOrganizerResponse.isEvent === false
        ) {
          const event = createEventFromOrg(org);
          event._organizerId = _id;
          const eventResponse = await lastValueFrom(
            this.eventService.createEvent(event)
          );
          org.ifEventId = eventResponse._id;
          await lastValueFrom(
            this.organizerService.updateOrganizer(org._id, org)
          );
        }

        //delete organizer event if changed to is not event
        if (
          org.isEvent.toString() === "false" &&
          updateOrganizerResponse.isEvent === true
        ) {
          // TODO: Find the correct event ID
          await lastValueFrom(this.eventService.deletEvent(org._id, _id));
        }
        resolve(updateOrganizerResponse);
      } catch (error) {
        reject(error);
      }
    });
  }
}
