import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { Organizer } from "@globals/models/organizer";
import { OrganizerService } from "@shared/services/organizer/organizer.web.service";
import { take } from "rxjs";

@Component({
  selector: "app-autocomplete-organizer",
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./autocomplete-organizer.component.html",
  styleUrls: ["./autocomplete-organizer.component.css"],
})
export class AutocompleteOrganizerComponent implements OnInit {
  @Output() emitOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  organizersIn: Organizer[] = [];
  organizerName = new FormControl("");
  filteredOrganizers: Organizer[];

  constructor(private organizerService: OrganizerService) {}

  ngOnInit(): void {
    this.organizerService.getOrganizer().pipe(take(1)).subscribe();
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
