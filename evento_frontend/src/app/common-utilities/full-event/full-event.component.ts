import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { NgxSpinnerService } from "ngx-spinner";
import { map } from "rxjs";
import { delay, switchMap, take } from "rxjs/operators";
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
      private organizerService: OrganizerService,
      private gtmService: GoogleTagManagerService
    ) { }

    ngOnInit(): void {
      this.storage$ = this.sessionStorageService.getLocation().subscribe(position => { this.currentPosition = position; });
      this.params$ = this.route.params
        .pipe(
          map((eventIdParam) => eventIdParam["eventId"]),
          switchMap((eventId) => this.eventService.getEventById(eventId)),
          map((event) => (this.event = event[0])),
          switchMap((event) => this.organizerService.getOrganizerById(event._organizerId)
          ),
          map((organizerResponse) => this.organizer = organizerResponse[0]),
          delay(150),
          take(1)
        )
        .subscribe(
          {
            next: () => {
              const gtmTag = {
                event: 'eventOfOrganizer',
                organizerName: this.organizer.name,
                eventName: this.event.name,
                eventCategory: this.event.category.name,
                clickDate: new Date().toISOString(),
                clickWeekday: new Date().getDay().toString(),
                clickTime: `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`,
              };
              this.gtmService.pushTag(gtmTag);
              const adressStringUrl = encodeURIComponent(
                `${this.event.address?.street} ${this.event.address?.streetNumber} ${this.event.address?.city}`
              );
              this.gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${adressStringUrl}`;

            },
            error: (error) => { console.log(error); },
            complete: () => {
              //this.clearQueryParams(); not working
              this.spinner.hide();
            }
          }
        );

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
        this.params$.unsubscribe();
      }
      if (this.storage$) {
        this.storage$.unsubscribe();
      }
    }
  };

