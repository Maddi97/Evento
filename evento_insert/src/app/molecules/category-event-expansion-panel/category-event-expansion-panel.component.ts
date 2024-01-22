import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Category } from "src/app/models/category";
import { EventsService } from "src/app/services/events.web.service";

@Component({
  selector: "app-category-event-expansion-panel",
  templateUrl: "./category-event-expansion-panel.component.html",
  styleUrls: ["./category-event-expansion-panel.component.css"],
})
export class CategoryEventExpansionPanelComponent {
  @Input() category: Category = new Category();
  @Output() emitInputEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitDeleteEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitFilteredList: EventEmitter<Event[]> = new EventEmitter<
    Event[]
  >();
  constructor(private eventService: EventsService) {}

  getEventsOnSubcategory = (subcategory) => {
    return this.eventService.getUpcomingventsOnCategoryAndSubcategory(
      subcategory
    );
  };

  getEventsOnCategory = (category) => {
    return this.eventService.getUpcomingventsOnCategory(category);
  };
}
