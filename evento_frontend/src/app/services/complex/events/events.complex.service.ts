import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { EventService } from "../../simple/events/event.service";
import { Event } from "../../../globals/models/event";

@Injectable({
  providedIn: "root",
})
export class EventsComplexService {
  constructor(private eventService: EventService) {}

  getEventsSubscriptionBasedOnTypeAndCategory(req) {
    let event$: Observable<Event[]>;
    if (req.event === "Params") {
      if (!req.cat.find((el) => el._id === "1" || el._id === "2")) {
        event$ = this.eventService.getEventsOnDateCategoryAndSubcategory(req);
      } else if (req.cat.find((el) => el._id === "1")) {
        event$ = this.eventService.getHotEvents(req);
      } else if (req.cat.find((el) => el._id === "2")) {
        // if hot filter by date
        event$ = this.eventService.getEventsOnDate(req.date, req.time);
      }
    } else {
      event$ = this.eventService.getEventsBySearchString(req);
    }
    return event$;
  }
}
