import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/custom-dialog/custom-dialog.component';
import { Event } from 'src/app/models/event';
import { Organizer } from 'src/app/models/organizer';
import { EventsService } from 'src/app/services/events.web.service';
import { FileUploadService } from 'src/app/services/files/file-upload.service';
import { NominatimGeoService } from 'src/app/services/location/nominatim-geo.service';
import { OrganizerService } from 'src/app/services/organizer.web.service';
import { createEventFromOrg } from '../../organizer/organizer-view/organizer.helpers';
import { createEventForSpecificCrawler } from '../crawl-event.helpers';
@Component({
  selector: 'app-crawled-events-to-event',
  templateUrl: './crawled-events-to-event.component.html',
  styleUrls: ['./crawled-events-to-event.component.css']
})
export class CrawledEventsToEventComponent implements OnInit, OnChanges {
  @Input() eventIn: Partial<Event>;
  @Input() organizerIn: Organizer[];
  @Output() emitAddEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitSkipEvent: EventEmitter<void> = new EventEmitter<void>();

  shouldInputOrganizer = false;
  inputOrganizer: Organizer;
  inputEvent: Event = new Event();
  shouldInputEvent = false;

  // subscriptions
  category$
  categories
  organizer$;
  createOrganizer$;
  updateOrganizer$;
  deleteOrganizer$;
  eventImagePath = "images/eventImages/";


  constructor(
    private _snackbar: MatSnackBar,
    private geoService: NominatimGeoService,
    private eventService: EventsService,
    private fileService: FileUploadService,
    private organizerService: OrganizerService,
    public dialog: MatDialog


  ) {

  }

  ngOnInit(): void {
    this.findOrganizer()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.findOrganizer()
  }

  findOrganizer() {
    const filteredOrganizer = this.organizerIn.filter((organizer) =>
      organizer.name.toLowerCase() === this.eventIn.organizerName.toLowerCase()
    );
    if (filteredOrganizer.length < 1) {
      this.inputOrganizer = new Organizer()
      this.inputOrganizer.name = this.eventIn.organizerName
      this.shouldInputOrganizer = true
      this.shouldInputEvent = false

    }
    else {

      this.inputOrganizer = filteredOrganizer[0]
      //todo Event befüllen
      this.inputEvent = this.createInputEvent()
      this.shouldInputEvent = true
      this.shouldInputOrganizer = false
    }
  }
  skipThisEvent() {
    this.emitSkipEvent.emit();
  }
  addNewOrganizer(organizer): void {
    // create organizerObject From FormField organizerForm
    const org = organizer
    const address = org.address

    // first fetch geo data from osm API and than complete event data type and send to backend
    this.createOrganizer$ = this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
      .pipe(
        map(
          geoData => {
            if (Object.keys(geoData).length < 1) {
              throw new Error('No coordinates found to given address');
            }
            org.geoData.lat = geoData[0].lat;
            org.geoData.lon = geoData[0].lon;

            this.organizerService.createOrganizer(org)
              .pipe(
                map(
                  createOrganizerResponse => {
                    const _id = createOrganizerResponse._id;
                    // upload image
                    org._id = createOrganizerResponse._id
                    const formdata = org.fd
                    // fd only for passing formdata form input
                    delete org.fd
                    if (formdata !== undefined) {
                      const fullEventImagePath = this.organizerImagePath + createOrganizerResponse._id
                      formdata.append('organizerImagePath', fullEventImagePath)
                      this.fileService.uploadOrganizerImage(formdata).subscribe(
                        uploadImageResponse => {
                          org.organizerImagePath = uploadImageResponse.organizerImage.path
                          this.organizerService.updateOrganizer(_id, org).subscribe()
                        })
                    }

                    if (createOrganizerResponse.isEvent === true) {
                      // if org is event than create also an event object
                      const event = createEventFromOrg(org)
                      event._organizerId = _id
                      this.eventService.createEvent(event).subscribe(
                        (eventResponse) => {
                          org.ifEventId = eventResponse._id
                          this.organizerService.updateOrganizer(_id, org).subscribe(
                          )
                        }
                      )
                    }
                    // spezifisch für crawler
                    this.organizerIn.push(createOrganizerResponse)
                    this.findOrganizer()
                    this.openSnackBar('Successfully added: ' + createOrganizerResponse.name, 'success')
                  }),
              ).subscribe()
          }
        ),
        catchError(err => {
          this.openSnackBar('Error: ' + err, 'error')
          throw err
        })).subscribe()
  }
  addEventCheckDuplicate(event) {
    this.eventService
      .checkIfEventsExistsInDB(event)
      .pipe(
        map((existingEvents) => {
          if (existingEvents.length > 0) {
            this.openDialogIfDuplicate(existingEvents, event);
            this.emitSkipEvent.emit()
          } else {
            this.addNewEvent(event);
          }
        }),
        catchError((error) => {
          console.error('Error checking duplicate', error);
          this.openSnackBar(error.message, "error")
          return of(null); // Continue with null eventImagePath
        }),
      ).subscribe();
  }

  openDialogIfDuplicate(events: Event[], event) {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: { currentEvent: event, events: events },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewEvent(event);
      } else {
        this.openSnackBar("Event not added " + event.name, "error");
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
                console.error('Error uploading event image:', uploadImageError);
                this.openSnackBar(uploadImageError.message, "error")
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
          return this.eventService.updateEvent(
            event._organizerId,
            event._id,
            event
          ).pipe(
            catchError((updateEventError) => {
              console.error('Error updating event:', updateEventError);
              this.openSnackBar(updateEventError.message, "error")
              return of(null); // Continue without showing success message
            }),
            tap(() => {
              this.emitAddEvent.emit(this.eventIn);
              this.openSnackBar(
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
          console.error('Error:', error);
          this.openSnackBar(error.message, "error")

          // Handle error here, e.g., show an error message to the user.
        }
      );
  }
  createInputEvent(): Event {
    return createEventForSpecificCrawler('urbanite', this.eventIn, this.inputOrganizer)
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: state !== "error" ? "green-snackbar" : "red-snackbar",
    });
  }
}
