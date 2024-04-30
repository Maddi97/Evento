import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CategorySelectComponent } from "@forms/shared/category-select/category-select.component";
import { Organizer } from "@globals/models/organizer";
import { AutocompleteOrganizerComponent } from "@shared/atoms/autocomplete-organizer/autocomplete-organizer.component";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { transformFormFieldToOrganizer } from "../../../logic/organizer.helpers";

import { AddNameAndAliasFormComponent } from "@forms/organizer/add-name-and-alias-form/add-name-and-alias-form.component";
import { OpeningTimesFormComponent } from "@shared/forms/shared/opening-times-form/opening-times-form.component";
import { OrganizerAdditionalInfoFormComponent } from "@forms/organizer/organizer-additional-info-form/organizer-additional-info-form.component";
import { ID } from "@globals/types/common.types";
import { AddressFormComponent } from "@shared/forms/shared/address-form/address-form.component";
import { FormSubmitionButtonsComponent } from "@shared/forms/shared/form-submition-buttons/form-submition-buttons.component";
import { SelectFilesFormComponent } from "@shared/forms/shared/select-files-form/select-files-form.component";
@Component({
  selector: "app-organizer-form",
  standalone: true,
  imports: [
    CommonModule,
    SelectionListComponent,
    MatCheckboxModule,

    CategorySelectComponent,
    MatFormFieldModule,
    MatInputModule,

    ReactiveFormsModule,

    AutocompleteOrganizerComponent,
    AddressFormComponent,
    OpeningTimesFormComponent,
    AddNameAndAliasFormComponent,
    OrganizerAdditionalInfoFormComponent,
    FormSubmitionButtonsComponent,
    SelectFilesFormComponent,
  ],
  templateUrl: "./organizer-form.component.html",
  styleUrls: ["./organizer-form.component.css"],
})
export class OrganizerFormComponent implements OnChanges {
  @Input() organizerIn: Organizer;
  @Input() allOrganizerIn: Organizer[] = [];
  @Input({ required: true }) page: "crawler" | "insert" = "insert";
  @Output() updateOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();
  @Output() addNewOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  updateOrganizerId: ID = "";

  organizerForm: FormGroup;
  isOpeningTimesRequired = new FormControl(false, []);

  constructor() {
    // will be filled by the child components
    this.organizerForm = new FormGroup({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.organizerIn?.currentValue) {
      // first need to regirster subcontrols to fill the form automatically
      setTimeout(() => {
        this.organizerForm.patchValue(changes.organizerIn?.currentValue);
        this.updateOrganizerId = changes.organizerIn?.currentValue._id;
      }, 10);
    }
  }

  submitForm() {
    if (this.updateOrganizerId) this.emitUpdate();
    else this.emitAddOrganizer();
  }

  emitUpdate() {
    const organizer = transformFormFieldToOrganizer(
      this.organizerForm,
      this.updateOrganizerId
    );
    this.updateOrganizer.emit(organizer);
    this.resetForm();
  }

  emitAddOrganizer() {
    const organizer = transformFormFieldToOrganizer(this.organizerForm, "");
    this.addNewOrganizer.emit(organizer);
    this.resetForm();
  }

  resetForm() {
    this.organizerForm.reset(new Organizer());
    this.organizerIn = undefined;
    this.updateOrganizerId = "";
  }
}
