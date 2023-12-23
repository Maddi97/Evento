import { Event } from "../../models/event";
import { PossibleCrawlerNames } from "./crawl-events.component";
import { createEventIfz } from "./specific-crawler/ifz-helper";
import { createEventUrbanite } from "./specific-crawler/urbanite-helper";

export function createEventForSpecificCrawler(
  crawlerName: PossibleCrawlerNames,
  event,
  organizer
): Event {
  switch (crawlerName) {
    case "urbanite":
      return createEventUrbanite(event, organizer);
    case "ifz":
      return createEventIfz(event, organizer);
  }
}
