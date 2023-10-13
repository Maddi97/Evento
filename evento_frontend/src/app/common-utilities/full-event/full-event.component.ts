import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { map } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { EventService } from "src/app/events/event.service";
import { Event } from "../../models/event";
import { Organizer } from "../../models/organizer";
import { OrganizerService } from "../../organizer.service";
import {
  dateTimesFormater,
  openingTimesFormatter,
} from "../logic/opening-times-format-helpers";
import { SessionStorageService } from "../session-storage/session-storage.service";

@Component({
  selector: "app-full-event",
  templateUrl: "./full-event.component.html",
  styleUrls: ["./full-event.component.css"],
})
export class FullEventComponent implements OnInit, OnDestroy {
  currentPosition: Array<Number>;
  eventId: string;
  event: Event;
  organizer: Organizer;

  private storage$;
  private params$;

  IconURL = null;
  ImageURL = null;
  gmapsUrl = "https://www.google.com/maps/search/";
  public openingTimesFormatter = openingTimesFormatter;
  public dateTimesFormater = dateTimesFormater;
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sessionStorageService: SessionStorageService,
    private organizerService: OrganizerService
  ) { }

  ngOnInit(): void {
    this.storage$ = this.sessionStorageService.getLocation().subscribe(position => { this.currentPosition = position })
    this.spinner.show();
    this.params$ = this.route.params
      .pipe(
        map((eventIdParam) => eventIdParam["eventId"]),
        switchMap((eventId) => this.eventService.getEventById(eventId)),
        map((event) => (this.event = event[0])),
        switchMap((event) =>
          this.organizerService.getOrganizerById(event._organizerId)
        ),
        map((organizerResponse) => organizerResponse[0]),
        tap(() => {
          this.spinner.show(); // Show spinner when the observable starts
        })
      )
      .subscribe(
        {
          next: (organizer) => {
            this.organizer = organizer;
            const adressStringUrl = encodeURIComponent(
              `${this.event.address?.street} ${this.event.address?.streetNumber} ${this.event.address?.city}`
            );
            this.gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${adressStringUrl}`;
            this.clearQueryParams();
            this.spinner.hide()
          },
          error: (error) => { console.log(error) },
          complete: () => {
            console.log('Full event loaded complete');
          }
        }
      )
      ;

  }
  clearQueryParams() {
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
      queryParamsHandling: "merge",
    });
  }
  addHttpProtocol(url: string): string {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      return "https://" + url;
    }
    return url;
  }
  ngOnDestroy(): void {
    if (this.params$) {
      this.params$.unsubscribe()
    }
    if (this.storage$) {
      this.storage$.unsubscribe()
    }
  }
}
