import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { Observable, forkJoin, of } from "rxjs";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import { CustomDialogComponent } from "src/app/custom-dialog/custom-dialog.component";
import { Category } from "src/app/models/category";
import { Organizer } from "src/app/models/organizer";
import { CategoryService } from "src/app/services/category.service";
import { EventsService } from "src/app/services/events.web.service";
import { FileUploadService } from "src/app/services/files/file-upload.service";
import { OrganizerService } from "src/app/services/organizer.web.service";
import { Event } from "../../../models/event";
import { EventsObservableService } from '../../../services/events.observable.service';
import { SnackbarService } from "../../../services/utils/snackbar.service";

@Component({
  selector: "app-event-view",
  templateUrl: "./event-view.component.html",
  styleUrls: ["./event-view.component.css"],
})
export class EventViewComponent implements OnInit {
  eventIn: Event;

  categories: Category[];
  organizers: Organizer[] = [];
  allOrganizers: Organizer[] = [];

  filteredOptions: Observable<string[]>;
  allFilteredEvents: Event[];

  category$: Observable<Category[]>;
  organizer$: Observable<Organizer[]>;
  event$: Observable<Event[]>;
  eventImagePath = "images/eventImages/";
  deleteEvent$;
  constructor(
    private categoryService: CategoryService,
    private organizerService: OrganizerService,
    private eventService: EventsService,
    private eventObservableService: EventsObservableService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,


  ) { }

  ngOnInit(): void {
    this.category$ = this.categoryService.categories;
    this.organizer$ = this.organizerService.organizers;
    this.event$ = this.eventService.event;

    this.eventService
      .getEventsOnDate(
        moment(new Date()).utcOffset(0, false).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
      )
      .subscribe();

    this.category$.subscribe((cat) => (this.categories = cat));
    this.organizer$.subscribe((org) => (this.organizers = org));
    this.event$.subscribe((event) => {
      this.allFilteredEvents = event;
      this.downloadImage();
    });
    this.organizerService.getOrganizer().subscribe((org) => {
      this.allOrganizers = org;
    });
  }

  addEventCheckDuplicate(event) {
    this.eventService
      .checkIfEventsExistsInDB(event)
      .pipe(
        map((existingEvents) => {
          if (existingEvents.length > 0) {
            this.openDialogIfDuplicate(existingEvents, event);
          } else {
            this.addNewEvent(event);
          }
        }),
        catchError((error) => {
          console.error('Error checking duplicate', error);
          this.snackbar.openSnackBar(error.message, "error")
          return of(null); // Continue with null eventImagePath
        }),
      ).subscribe();
  }

  addNewEvent(event) {
    this.eventObservableService.addNewEvent(event).then((event) => {
      this.snackbar.openSnackBar(
        "Successfully added Event: " + event.name,
        "success"
      )
    }).catch((error) => {
      this.snackbar.openSnackBar(error.message, "error")

    })
  }

  updateEvent(event) {
    this.eventService
      .updateEvent(event._organizerId, event._id, event)
      .pipe(
        map((createEventResponse) => {
          // upload image
          const formdata = event.fd;
          delete event.fd;
          if (formdata !== undefined) {
            const fullEventImagePath = this.eventImagePath + event._id;
            formdata.append("eventImagePath", fullEventImagePath);
            this.fileService
              .uploadEventImage(formdata)
              .pipe(
                map((uploadImageResponse) => {
                  event.eventImagePath = uploadImageResponse.eventImage.path;
                  this.eventService.updateEvent(
                    event._organizerId,
                    event._id,
                    event
                  );
                })
              )
              .subscribe();
          }
          this.snackbar.openSnackBar(
            "Successfully updated Event: " + event.name,
            "success"
          );
        })
      )
      .subscribe();
  }

  loadOrganizerOnSubcategories(category: Category) {
    this.organizerService.filterOrganizerByEventsCategory(category);
  }

  loadEvents(organizerId: string, categoryId: string) {
    this.eventService.getAllUpcomingEvents().pipe(
      map((events) => {
        this.allFilteredEvents = events.filter(
          (event) =>
            event._organizerId === organizerId &&
            event.category._id === categoryId
        );
      })
    );
  }

  getHotEvents() {
    const date = moment(new Date())
      .utcOffset(0, false)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    this.eventService.getEventsOnDate(date);
  }

  deleteEvent(event: Event) {
     if (confirm('Are you sure to delete ' + event.name + ' ?')) {
            this.deleteEvent$ = this.eventService.deletEvent(event._organizerId, event._id)
            this.deleteEvent$.pipe(
                concatMap(
                    () => this.fileService.deleteFile(event.eventImagePath)
                )
            ).subscribe();
        }
  }

  timeSince(date) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  timeSinceInteger(date) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    return seconds / 86400;
  }

  getColor(organizer: Organizer): string {
    if (
      organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <=
      1
    ) {
      return "lightcoral";
    }
    if (
      1 < organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) &&
      organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) <= 5
    ) {
      return "orange";
    }
    if (
      organizer.frequency - this.timeSinceInteger(organizer.lastUpdated) >
      5
    ) {
      return "lightgreen";
    }
  }

  loadActualEventsByCategory(category: Category) {
    this.eventService.getActualEventsOnCategory(category);
  }

  downloadImage() {
    this.allFilteredEvents.forEach((event) => {
      let imageURL = null;
      if (event.eventImagePath !== undefined) {
        if (event.eventImageTemporaryURL === undefined) {
          this.fileService
            .downloadFile(event.eventImagePath)
            .subscribe((imageData) => {
              // create temporary Url for the downloaded image and bypass security
              const unsafeImg = URL.createObjectURL(imageData);
              imageURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
              event.eventImageTemporaryURL = imageURL;
            });
        }
      }
    });
  }
  openDialogIfDuplicate(events: Event[], event) {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: { currentEvent: event, events: events },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewEvent(event);
      } else {
        this.snackbar.openSnackBar("Event not added " + event.name, "error");
      }
    });
  }
  getOutdatedEvents() {
    this.eventService.getOutdatedEvents().subscribe();
  }
  getAllEvents() {
    this.eventService.getAllEvents().subscribe()
  }
  deleteOutdatedEvents() {
    if (confirm('Are you sure to delete all events older than 30 days')
    ) {
      this.eventService.deleteOutdatedEvents().pipe(
        switchMap((response: any) => {
          const deletedEvents = response.outdatedEvents
          const deleteObservables: Observable<void>[] = deletedEvents.map(event => {
            return this.fileService.deleteFile(event.eventImagePath);
          });

          // Execute all delete observables in parallel and wait for all to complete
          return forkJoin(deleteObservables);
        }),
      ).subscribe()
    }
  }
}
