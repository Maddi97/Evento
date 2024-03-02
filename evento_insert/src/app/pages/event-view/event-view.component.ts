import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CustomDialogComponent } from "@atoms/custom-dialog/custom-dialog.component";
import { Category } from "@globals/models/category";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import { ExpansionPanelComponent } from "@shared/molecules/expansion-panel/expansion-panel.component";
import { CategoryService } from "@shared/services/category/category.service";
import { EventsObservableService } from "@shared/services/events/events.observable.service";
import { EventsService } from "@shared/services/events/events.web.service";
import { FileUploadService } from "@shared/services/files/file-upload.service";
import { OrganizerService } from "@shared/services/organizer/organizer.web.service";
import { SnackbarService } from "@shared/services/utils/snackbar.service";
import moment from "moment";
import { Observable, forkJoin, of } from "rxjs";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import { MapViewComponent } from "@shared/molecules/map-view/map-view.component";
import { CategoryEventExpansionPanelComponent } from "@shared/molecules/category-event-expansion-panel/category-event-expansion-panel.component";
import { EventFormComponent } from "@forms/event/event-form/event-form.component";

@Component({
  selector: "app-event-view",
  standalone: true,
  imports: [
    CommonModule,
    ExpansionPanelComponent,
    MapViewComponent,
    CategoryEventExpansionPanelComponent,
    EventFormComponent,
  ],
  templateUrl: "./event-view.component.html",
  styleUrls: ["./event-view.component.css"],
})
export class EventViewComponent implements OnInit {
  eventIn: Event;

  categories: Category[];
  organizers: Organizer[] = [];
  allOrganizers: Organizer[] = [];

  filteredOptions: Observable<string[]>;
  allFilteredEvents: Event[] = [];

  category$: Observable<Category[]>;
  organizer$: Observable<Organizer[]>;
  event$: Observable<Event[]>;
  eventImagePath = "images/eventImages/";
  deleteEvent$;
  constructor(
    private categoryService: CategoryService,
    private organizerService: OrganizerService,
    public eventService: EventsService,
    private eventObservableService: EventsObservableService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    private fileService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoryService.getCategories();
    this.organizer$ = this.organizerService.organizers;
    this.event$ = this.eventService.event;

    this.category$.subscribe((cat) => (this.categories = cat));
    this.organizer$.subscribe((org) => (this.organizers = org));

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
          console.error("Error checking duplicate", error);
          this.snackbar.openSnackBar(error.message, "error");
          return of(null); // Continue with null eventImagePath
        })
      )
      .subscribe();
  }

  addNewEvent(event) {
    this.eventObservableService
      .addNewEvent(event)
      .then((event) => {
        this.snackbar.openSnackBar(
          "Successfully added Event: " + event.name,
          "success"
        );
      })
      .catch((error) => {
        this.snackbar.openSnackBar(error.message, "error");
      });
  }

  updateEvent(event) {
    this.eventObservableService
      .updateEvent(event)
      .then((event) => {
        this.snackbar.openSnackBar(
          "Successfully updated Event: " + event.name,
          "success"
        );
      })
      .catch((error) => {
        this.snackbar.openSnackBar(error.message, "error");
      });
  }

  getEventsRightNow = () => {
    const date = moment(new Date())
      .utcOffset(0, false)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    //this.eventService.getEventsOnDate(date, "00:00");
    //console.error("Not implemented yet");
    return of([]);
  };
  getOutdatedEvents = () => {
    return this.eventService.getOutdatedEvents();
  };
  getAllEvents = () => {
    return this.eventService.getAllEvents();
  };
  getHotEvents = () => {
    const germanyTime = moment(
      new Date().toLocaleTimeString("en-DE", {
        timeZone: "Europe/Berlin",
      })
    )
      .utcOffset(0, false)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return this.eventService.getAllHotEvents({ date: germanyTime });
  };
  getFrequentEvents = () => {
    return this.eventService.getFrequentEvents();
  };

  deleteEvent(event: Event) {
    if (confirm("Are you sure to delete " + event.name + " ?")) {
      this.deleteEvent$ = this.eventService.deletEvent(
        event._organizerId,
        event._id
      );
      this.deleteEvent$
        .pipe(
          concatMap(() => this.fileService.deleteFile(event.eventImagePath))
        )
        .subscribe();
    }
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

  deleteOutdatedEvents() {
    if (confirm("Are you sure to delete all events older than 30 days")) {
      this.eventService
        .deleteOutdatedEvents()
        .pipe(
          switchMap((response: any) => {
            const deletedEvents = response.outdatedEvents;
            const deleteObservables: Observable<void>[] = deletedEvents.map(
              (event) => {
                return this.fileService.deleteFile(event.eventImagePath);
              }
            );

            // Execute all delete observables in parallel and wait for all to complete
            return forkJoin(deleteObservables);
          })
        )
        .subscribe();
    }
  }
}
