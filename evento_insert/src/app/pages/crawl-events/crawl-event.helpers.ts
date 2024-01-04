import { Event } from "../../models/event";
import { PossibleCrawlerNames } from "./crawl-events.component";
import { createEventIfz } from "./specific-crawler/ifz-helper";

export function createEventForSpecificCrawler(
  crawlerName: PossibleCrawlerNames,
  event,
  organizer
): Event {
  switch (crawlerName) {
    case "ifz":
      return createEventIfz(event, organizer);
  }
}
