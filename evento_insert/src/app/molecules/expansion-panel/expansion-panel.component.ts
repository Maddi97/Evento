import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { emit } from "process";
import { Observable } from "rxjs";
import { Event } from "src/app/models/event";

@Component({
  selector: "app-expansion-panel",
  templateUrl: "./expansion-panel.component.html",
  styleUrls: ["./expansion-panel.component.css"],
})
export class ExpansionPanelComponent implements OnInit {
  @Input() eventSubscription: (...args: any[]) => Observable<Event[]>;
  @Input() title: string = "Open to see all";
  @Input() parameter: any = undefined;
  @Output() emitInputEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitDeleteEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitFilteredList: EventEmitter<Event[]> = new EventEmitter<
    Event[]
  >();

  eventList: Event[] = [];

  ngOnInit() {}

  onExpansion = () => {
    this.eventSubscription(this.parameter ? this.parameter : null).subscribe(
      (events) => {
        this.eventList = events;
        this.emitFilteredList.emit(this.eventList);
      }
    );
  };
}
