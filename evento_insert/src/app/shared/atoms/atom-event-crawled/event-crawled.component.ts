import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import { USDateFormatPipe } from "@shared/pipes/DateToUSFormat.pipe";

@Component({
  selector: "app-event-crawled",
  standalone: true,
  imports: [CommonModule, USDateFormatPipe],
  templateUrl: "./event-crawled.component.html",
  styleUrls: ["./event-crawled.component.css"],
})
export class EventCrawledComponent {
  @Input() eventIn: Event;
  @Input() organizerIn: Organizer;
  ngOnInit() {
    console.log("1", this.eventIn);
    console.log("2", this.organizerIn);
  }
}
