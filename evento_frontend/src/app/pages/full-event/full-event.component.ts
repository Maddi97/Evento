import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Event } from "../../globals/models/event";
import { Organizer } from "../../globals/models/organizer";
import { PositionService } from "../../services/core/location/position.service";
import { EventService } from "../../services/simple/events/event.service";
import { OrganizerService } from "../../services/simple/organizer/organizer.service";
import {
  dateTimesFormater,
  openingTimesFormatter,
} from "../../shared/logic/opening-times-format-helpers";
import { MapViewComponent } from "../../shared/molecules/map-view/map-view.component";
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { NgxSpinnerService } from "ngx-spinner";
import { map } from "rxjs";
import { delay, switchMap, take } from "rxjs/operators";
import { SocialMediaShareComponent } from "@shared/molecules/social-media-share/social-media-share.component";
import { EventPictureComponent } from "@shared/atoms/event-picture/event-picture.component";
@Component({
  selector: "app-full-event",
  standalone: true,
  imports: [
    CommonModule,
    MapViewComponent,
    SocialMediaShareComponent,
    EventPictureComponent,
  ],
  templateUrl: "./full-event.component.html",
  styleUrls: ["./full-event.component.css"],
})
export class FullEventComponent implements OnInit, OnDestroy {
  currentPosition: Array<Number>;
  eventId: string;
  event: Event;
  organizer: Organizer;

  private position$;
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
    private positionService: PositionService,
    private organizerService: OrganizerService,
    private gtmService: GoogleTagManagerService
  ) {}

  ngOnInit(): void {
    this.position$ = this.positionService.positionObservable.pipe(
      map((position) => {
        this.currentPosition = position;
      })
    );
    this.params$ = this.route.params
      .pipe(
        map((eventIdParam) => eventIdParam["eventId"]),
        switchMap((eventId) => this.eventService.getEventById(eventId)),
        map((event) => (this.event = event[0])),
        switchMap((event) =>
          this.organizerService.getOrganizerById(event._organizerId)
        ),
        map((organizerResponse) => (this.organizer = organizerResponse[0])),
        take(1),
        switchMap(() => this.position$)
      )
      .subscribe({
        next: () => {
          const gtmTag = {
            event: "eventOfOrganizer",
            organizerName: this.organizer.name,
            eventName: this.event.name,
            eventCategory: this.event.category.name,
            clickDate: new Date().toISOString(),
            clickWeekday: new Date().getDay().toString(),
            clickTime: `${new Date().getHours().toString()}:${new Date()
              .getMinutes()
              .toString()}`,
          };
          this.gtmService.pushTag(gtmTag);
          const adressStringUrl = encodeURIComponent(
            `${this.event.address?.street} ${this.event.address?.streetNumber} ${this.event.address?.city}`
          );
          this.gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${adressStringUrl}`;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          //this.clearQueryParams(); not working
          this.spinner.hide();
        },
      });
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
    if (this.position$) {
      this.position$.unsubscribe();
    }
  }
}
