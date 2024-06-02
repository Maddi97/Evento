import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { AutocompleteOrganizerComponent } from "@shared/atoms/autocomplete-organizer/autocomplete-organizer.component";
import { Organizer } from "@globals/models/organizer";
@Component({
  selector: "app-add-name-and-alias-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SelectionListComponent,
    AutocompleteOrganizerComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./add-name-and-alias-form.component.html",
  styleUrl: "./add-name-and-alias-form.component.css",
})
export class AddNameAndAliasFormComponent {
  @Input({ required: true }) isOrganizerInsertView: boolean;
  @Input() isOrganizerCrawlerView: boolean = false;

  @Output() emitOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  isOrganizerView;
  nameFormControl: FormControl<string>;
  aliasFormControl: FormControl<Array<string>>;
  aliasInputControl: FormControl<string> = new FormControl("");
  parentContainer = inject(ControlContainer);

  ngOnInit() {
    this.nameFormControl = new FormControl("", Validators.required);
    this.parentFormGroup.addControl("name", this.nameFormControl);

    this.aliasFormControl = new FormControl([]);
    this.parentFormGroup.addControl("alias", this.aliasFormControl);
  }

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl("name");
    this.parentFormGroup.removeControl("alias");
  }

  updateOrganizerNameFromAutocomplete(organizer: Organizer) {
    if (this.isOrganizerCrawlerView) {
      organizer.alias.push(this.nameFormControl.value);
      this.emitOrganizer.emit(organizer);
    } else {
      this.nameFormControl.patchValue(organizer.name);
    }
  }

  pushAliasToForm() {
    const alias = this.aliasFormControl.value;
    alias.push(this.aliasInputControl.value);
    this.aliasFormControl.patchValue(alias);
    this.aliasInputControl.reset("");
  }
}
