import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Event } from "@globals/models/event";
import { PositionService } from "@services/core/location/position.service";
import { OrganizerService } from "@services/simple/organizer/organizer.service";
import {
  dateTimesFormater,
  openingTimesFormatter,
} from "@shared/logic/opening-times-format-helpers";
import { isScreenMinWidth } from "@shared/logic/screen-size-helpers";
import { first, map, tap } from "rxjs";
import { EventPictureComponent } from "../event-picture/event-picture.component";

@Component({
  selector: "app-event-tile",
  standalone: true,
  imports: [CommonModule, MatCardModule, EventPictureComponent],
  templateUrl: "./event-tile.component.html",
  styleUrls: ["./event-tile.component.css"],
})
export class EventTileComponent implements OnInit, OnChanges {
  @Input() event: Event;
  @Input() distance;

  IconURL = null;
  ImageURL = null;
  organizerOfEvent$;
  isScreemMin1000px;
  hasUserPosition;
  public openingTimesFormatter = openingTimesFormatter;
  public dateTimesFormater = dateTimesFormater;
  public isScreenMinWidth = isScreenMinWidth;

  constructor(
    private organizerService: OrganizerService,
    private positionService: PositionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScreemMin1000px = isScreenMinWidth(1000);
    }
    this.organizerOfEvent$ = this.organizerService
      .getOrganizerById(this.event._organizerId)
      .pipe(
        first(),
        map((organizerResponse) => organizerResponse[0])
      );
    this.positionService.isPositionDefault.subscribe(
      (isPositionDefault) => (this.hasUserPosition = !isPositionDefault)
    );
    this.distance = Math.round(this.distance * 100) / 100; // 2 decimals
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.distance) {
      this.distance = Math.round(this.distance * 100) / 100; // 2 decimals
    }
  }
}
