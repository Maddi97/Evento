import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Category } from "@globals/models/category";
import { EventsService } from "@shared/services/events/events.web.service";
import { ExpansionPanelComponent } from "../expansion-panel/expansion-panel.component";

@Component({
  selector: "app-category-event-expansion-panel",
  standalone: true,
  imports: [CommonModule, MatExpansionModule, ExpansionPanelComponent],
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
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.eventService.getUpcomingventsOnCategoryAndSubcategory(
      subcategory,
      date
    );
  };

  getEventsOnCategory = (category) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.eventService.getUpcomingventsOnCategory(category, date);
  };
}
