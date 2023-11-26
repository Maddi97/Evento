import { Event } from "../../models/event";
import { createEventUrbanite } from "./specific-crawler/urbanite-helper";
export type Crawler = "urbanite";

export function createEventForSpecificCrawler(
  crawlerName: Crawler,
  event,
  organizer
): Event {
  switch (crawlerName) {
    case "urbanite":
      return createEventUrbanite(event, organizer);
  }
}
