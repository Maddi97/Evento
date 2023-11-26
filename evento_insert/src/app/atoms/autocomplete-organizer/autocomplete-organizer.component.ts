import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Organizer } from "src/app/models/organizer";

@Component({
  selector: "app-autocomplete-organizer",
  templateUrl: "./autocomplete-organizer.component.html",
  styleUrls: ["./autocomplete-organizer.component.css"],
})
export class AutocompleteOrganizerComponent implements OnInit {
  @Input() organizersIn: Organizer[] = [];
  @Output() emitOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  organizerName = new FormControl("");
  filteredOrganizers: Organizer[];
  ngOnInit(): void {
    this.filteredOrganizers = this.organizersIn;
    this.organizerName.valueChanges.subscribe((oNameStart) => {
      this.filteredOrganizers = this.filterOrganizerByNameAndAlias(oNameStart);
    });
  }

  filterOrganizerByName(oNameStart): Organizer[] {
    return this.organizersIn.filter((organizer) =>
      organizer.name.toLowerCase().startsWith(oNameStart.toLowerCase())
    );
  }

  filterOrganizerByNameAndAlias(oNameStart): Organizer[] {
    return this.organizersIn.filter(
      (organizer) =>
        organizer.name.toLowerCase().startsWith(oNameStart.toLowerCase()) ||
        organizer.alias.some((aliasName) =>
          aliasName.toLowerCase().startsWith(oNameStart.toLowerCase())
        )
    );
  }

  onOrganizerSelected(organizerName: string) {
    const organizer = this.filterOrganizerByNameAndAlias(organizerName).pop();
    this.emitOrganizer.emit(organizer);
  }
}
