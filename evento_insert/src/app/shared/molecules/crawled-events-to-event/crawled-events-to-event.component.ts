import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { CustomDialogComponent } from "@atoms/custom-dialog/custom-dialog.component";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import { EventsService } from "@shared/services/events/events.web.service";
import { FileUploadService } from "@shared/services/files/file-upload.service";
import { OrganizerObservableService } from "@shared/services/organizer/organizer.observable.service";
import { SnackbarService } from "@shared/services/utils/snackbar.service";
import { CommonModule } from "@angular/common";
import { EventFormComponent } from "../event-form/event-form.component";
import { OrganizerFormComponent } from "../organizer-form/organizer-form.component";
import { EventCrawledComponent } from "../../atoms/atom-event-crawled/event-crawled.component";

@Component({
  selector: "app-crawled-events-to-event",
  standalone: true,
  imports: [
    CommonModule,
    EventCrawledComponent,
    EventFormComponent,
    OrganizerFormComponent,
  ],
  templateUrl: "./crawled-events-to-event.component.html",
  styleUrls: ["./crawled-events-to-event.component.css"],
})
export class CrawledEventsToEventComponent {
  @Input() eventIn;
  @Input() organizerIn: Organizer;
  @Input() allOrganizer: Organizer[];
  @Output() emitAddEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitNextEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() emitPreviousEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() emitOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  // subscriptions
  category$;
  categories;
  organizer$;
  createOrganizer$;
  updateOrganizer$;
  deleteOrganizer$;
  eventImagePath = "images/eventImages/";

  constructor(
    private snackbarService: SnackbarService,
    private eventService: EventsService,
    private fileService: FileUploadService,
    public dialog: MatDialog,
    private organizerOnservableService: OrganizerObservableService
  ) {}

  nextEvent() {
    this.emitNextEvent.emit();
  }
  previousEvent() {
    this.emitPreviousEvent.emit();
  }

  addNewOrganizer(organizer) {
    this.organizerOnservableService
      .addNewOrganizer(organizer)
      .then((organizerResponse) => {
        this.emitOrganizer.emit(organizerResponse);
        // TODO his.findOrganizer()
        this.snackbarService.openSnackBar(
          "Successfully added: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbarService.openSnackBar(error, "error"));
  }
  updateOrganizer(organizer): void {
    this.organizerOnservableService
      .updateOrganizer(organizer)
      .then((organizerResponse) => {
        this.nextEvent();
        this.snackbarService.openSnackBar(
          "Successfully added: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbarService.openSnackBar(error, "error"));
  }

  addEventCheckDuplicate(event) {
    this.eventService
      .checkIfEventsExistsInDB(event)
      .pipe(
        map((existingEvents) => {
          if (existingEvents.length > 0) {
            this.openDialogIfDuplicate(existingEvents, event);
            this.emitNextEvent.emit();
          } else {
            this.addNewEvent(event);
          }
        }),
        catchError((error) => {
          console.error("Error checking duplicate", error);
          this.snackbarService.openSnackBar(error.message, "error");
          return of(null); // Continue with null eventImagePath
        })
      )
      .subscribe();
  }

  openDialogIfDuplicate(events: Event[], event) {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: { currentEvent: event, events: events },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewEvent(event);
      } else {
        this.snackbarService.openSnackBar(
          "Event not added " + event.name,
          "error"
        );
      }
    });
  }
  addNewEvent(event) {
    // set _id undefined otherwise error occurs
    event._id = undefined;

    this.eventService
      .createEvent(event)
      .pipe(
        switchMap((createEventResponse) => {
          event._id = createEventResponse._id;
          const formdata = event.fd;
          delete event.fd;
          if (formdata !== undefined) {
            const fullEventImagePath =
              this.eventImagePath + createEventResponse._id;
            formdata.append("eventImagePath", fullEventImagePath);
            return this.fileService.uploadEventImage(formdata).pipe(
              catchError((uploadImageError) => {
                console.error("Error uploading event image:", uploadImageError);
                this.snackbarService.openSnackBar(
                  uploadImageError.message,
                  "error"
                );
                return of(null); // Continue with null eventImagePath
              }),
              tap((uploadImageResponse) => {
                if (uploadImageResponse) {
                  event.eventImagePath = uploadImageResponse.eventImage.path;
                }
              })
            );
          }
          return of(null); // Continue with null eventImagePath
        }),
        switchMap((eventWithImagePath) => {
          return this.eventService
            .updateEvent(event._organizerId, event._id, event)
            .pipe(
              catchError((updateEventError) => {
                console.error("Error updating event:", updateEventError);
                this.snackbarService.openSnackBar(
                  updateEventError.message,
                  "error"
                );
                return of(null); // Continue without showing success message
              }),
              tap(() => {
                this.emitAddEvent.emit(this.eventIn);
                this.snackbarService.openSnackBar(
                  "Successfully added Event: " + event.name,
                  "success"
                );
              })
            );
        })
      )
      .subscribe(
        () => {
          // Success
        },
        (error) => {
          console.error("Error:", error);
          this.snackbarService.openSnackBar(error.message, "error");

          // Handle error here, e.g., show an error message to the user.
        }
      );
  }
}
