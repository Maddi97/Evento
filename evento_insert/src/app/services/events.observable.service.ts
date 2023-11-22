import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Event } from '../models/event';
import { CategoryService } from './category.service';
import { EventsService } from './events.web.service';
import { FileUploadService } from './files/file-upload.service';
import { OrganizerService } from './organizer.web.service';
import { SnackbarService } from './utils/snackbar.service';
@Injectable({
  providedIn: 'root'
})
export class EventsObservableService {
  eventImagePath = "images/eventImages/";

  constructor(
    private categoryService: CategoryService,
    private organizerService: OrganizerService,
    private eventService: EventsService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,
    private snackbar: SnackbarService,
    public dialog: MatDialog
  ) { }

  addNewEvent(event): Promise<Event> {
    return new Promise(async (resolve, reject) => {
      try {
        event._id = undefined;

        const createEventResponse = await lastValueFrom(this.eventService.createEvent(event));
        event._id = createEventResponse._id;

        const formdata = event.fd;
        delete event.fd;

        if (formdata !== undefined) {
          const fullEventImagePath = this.eventImagePath + createEventResponse._id;
          formdata.append("eventImagePath", fullEventImagePath);

          try {
            const uploadImageResponse = await lastValueFrom(this.fileService.uploadEventImage(formdata));
            if (uploadImageResponse) {
              event.eventImagePath = uploadImageResponse.eventImage.path;
            }
          } catch (uploadImageError) {
            console.error('Error uploading event image:', uploadImageError);
          }
        }

        const eventWithImagePath = await lastValueFrom(this.eventService.updateEvent(event._organizerId, event._id, event));
        console.log(eventWithImagePath)
        console.log(createEventResponse)
        resolve(createEventResponse)
      } catch (error) {
        console.error('Error:', error);
        reject(error)
      }
    })
  }

}
