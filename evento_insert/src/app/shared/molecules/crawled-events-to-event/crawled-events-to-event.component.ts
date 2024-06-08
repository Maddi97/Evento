import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
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
import { EventFormComponent } from "@forms/event/event-form/event-form.component";
import { OrganizerFormComponent } from "../../forms/organizer/organizer-form/organizer-form.component";
import { EventCrawledComponent } from "../../atoms/atom-event-crawled/event-crawled.component";
import { EventsObservableService } from "@shared/services/events/events.observable.service";

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
  @ViewChild("organizerFormComponent")
  organizerFormComponent: OrganizerFormComponent;
  @ViewChild("eventFormComponent")
  eventFormComponent: EventFormComponent;

  @Input() eventIn;
  @Input() organizerIn: Organizer;
  @Input() allOrganizer: Organizer[];
  @Output() emitAddEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitNextEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() emitPreviousEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() emitOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();
  @Output() emitSelectOrganizerForCrawledEvent: EventEmitter<Organizer> =
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
    private snackbar: SnackbarService,
    private eventObservableService: EventsObservableService,
    private organizerOnservableService: OrganizerObservableService,
    public dialog: MatDialog
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
        this.organizerFormComponent?.resetForm();
        this.emitOrganizer.emit(organizerResponse);
        // TODO his.findOrganizer()
        this.snackbar.openSnackBar(
          "Successfully added: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbar.openSnackBar(error, "error"));
  }
  updateOrganizer(organizer): void {
    this.organizerOnservableService
      .updateOrganizer(organizer)
      .then((organizerResponse) => {
        this.organizerFormComponent?.resetForm();
        this.snackbar.openSnackBar(
          "Successfully updated: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbar.openSnackBar(error, "error"));
  }
  updateEvent(event) {
    this.eventObservableService
      .updateEvent(event)
      .then((event) => {
        this.eventFormComponent?.resetForm();
        this.snackbar.openSnackBar(
          "Successfully updated Event: " + event.name,
          "success"
        );
      })
      .catch((error) => {
        this.snackbar.openSnackBar(error.message, "error");
      });
  }

  addNewEvent(event: Event) {
    console.log("Add new event");
    this.eventObservableService
      .addNewEvent(event)
      .then((event) => {
        this.eventFormComponent.resetForm();
        this.emitNextEvent.emit();
        this.snackbar.openSnackBar(
          "Successfully added Event: " + event.name,
          "success"
        );
      })
      .catch((error) => {
        this.snackbar.openSnackBar(error.message, "error");
        this.eventIn = null;
        setTimeout(() => (this.eventIn = event), 10);
      });
  }
}
