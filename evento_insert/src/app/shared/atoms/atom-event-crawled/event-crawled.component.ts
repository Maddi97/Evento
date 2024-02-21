import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";

@Component({
  selector: "app-event-crawled",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./event-crawled.component.html",
  styleUrls: ["./event-crawled.component.css"],
})
export class EventCrawledComponent {
  @Input() eventIn: Event;
  @Input() organizerIn: Organizer;
}
