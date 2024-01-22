import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Event } from "src/app/models/event";
@Component({
  selector: "app-event-panel",
  templateUrl: "./event-panel.component.html",
  styleUrls: ["./event-panel.component.css"],
})
export class EventPanelComponent {
  @Input() event: Event;
  @Output() emitInputEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitDeleteEvent: EventEmitter<Event> = new EventEmitter<Event>();
}
