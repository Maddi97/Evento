import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs/internal/lastValueFrom";
import { Event } from "../../../globals/models/event";
import { EventsService } from "./events.web.service";
import { FileUploadService } from "../files/file-upload.service";
@Injectable({
  providedIn: "root",
})
export class EventsObservableService {
  eventImagePath = "images/eventImages/";

  constructor(
    private eventService: EventsService,
    private fileService: FileUploadService,
    public dialog: MatDialog
  ) {}

  addNewEvent(event): Promise<Event> {
    return new Promise(async (resolve, reject) => {
      try {
        event._id = undefined;

        const createEventResponse = await lastValueFrom(
          this.eventService.createEvent(event)
        );
        event._id = createEventResponse._id;

        const formdata = event.fd;
        delete event.fd;

        if (formdata) {
          const fullEventImagePath =
            this.eventImagePath + createEventResponse._id;
          formdata.append("eventImagePath", fullEventImagePath);

          try {
            const uploadImageResponse = await lastValueFrom(
              this.fileService.uploadEventImage(formdata)
            );
            if (uploadImageResponse) {
              event.eventImagePath = uploadImageResponse.eventImage.path;
            }
          } catch (uploadImageError) {
            console.error("Error uploading event image:", uploadImageError);
          }
        }

        await lastValueFrom(
          this.eventService.updateEvent(event._organizerId, event._id, event)
        );
        resolve(createEventResponse);
      } catch (error) {
        console.error("Error:", error);
        reject(error);
      }
    });
  }

  updateEvent(event): Promise<Event> {
    return new Promise(async (resolve, reject) => {
      try {
        const createEventResponse = await lastValueFrom(
          this.eventService.updateEvent(event._organizerId, event._id, event)
        );
        const formdata = event.fd;
        delete event.fd;

        if (formdata) {
          const fullEventImagePath =
            this.eventImagePath + createEventResponse._id;
          formdata.append("eventImagePath", fullEventImagePath);

          try {
            const uploadImageResponse = await lastValueFrom(
              this.fileService.uploadEventImage(formdata)
            );
            if (uploadImageResponse) {
              event.eventImagePath = uploadImageResponse.eventImage.path;
            }
          } catch (uploadImageError) {
            console.error("Error uploading event image:", uploadImageError);
          }
        }

        await lastValueFrom(
          this.eventService.updateEvent(event._organizerId, event._id, event)
        );
        resolve(createEventResponse);
      } catch (error) {
        console.error("Error:", error);
        reject(error);
      }
    });
  }
}
