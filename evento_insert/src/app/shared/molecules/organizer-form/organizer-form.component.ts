import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Category } from "@globals//models/category";
import { Organizer } from "@globals/models/organizer";
import {
  getGeoDataTemplate,
  getOpeningTimesTemplate,
  getOrganizerFormTemplate,
  transformFormFieldToOrganizer,
} from "../../logic/organizer.helpers";
import { CommonModule } from "@angular/common";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { CategorySelectComponent } from "../category-select/category-select.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AutocompleteOrganizerComponent } from "@shared/atoms/autocomplete-organizer/autocomplete-organizer.component";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-organizer-form",
  standalone: true,
  imports: [
    CommonModule,
    SelectionListComponent,
    NgxMaterialTimepickerModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    CategorySelectComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteOrganizerComponent,
    MatButtonModule,
  ],
  templateUrl: "./organizer-form.component.html",
  styleUrls: ["./organizer-form.component.css"],
})
export class OrganizerFormComponent implements OnInit, OnChanges {
  @Input() organizerIn: Organizer = new Organizer();
  @Input() allOrganizerIn: Organizer[] = [];
  @Input() page: "crawler" | "insert" = "insert";
  @Output() updateOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();
  @Output() addNewOrganizer: EventEmitter<Organizer> =
    new EventEmitter<Organizer>();

  @ViewChild("imageUpload") inputImage: ElementRef;

  category: Category;
  openingTimes = getOpeningTimesTemplate();
  geoData = getGeoDataTemplate();
  updateOrganizerId = "";
  ifEventId;
  isOpeningTimesRequired = false;
  image: any;
  organizerForm;
  constructor(private fb: FormBuilder) {
    this.organizerForm = this.fb.group(getOrganizerFormTemplate());
  }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.organizerIn !== undefined) this.setOrganizerForm(this.organizerIn);
  }

  emitUpdate(organizerForm) {
    const organizer = transformFormFieldToOrganizer(
      organizerForm,
      this.category,
      this.openingTimes,
      this.geoData,
      this.updateOrganizerId
    );
    const formdata: FormData = new FormData();
    organizer.alias = this.organizerIn.alias;
    if (this.image !== undefined) {
      formdata.append("files", this.image);
      organizer["fd"] = formdata;
    } else organizer["fd"] = undefined;

    this.nullFormField();
    this.updateOrganizer.emit(organizer);
  }

  emitAddOrganizer(organizerForm) {
    const organizer = transformFormFieldToOrganizer(
      organizerForm,
      this.category,
      this.openingTimes,
      this.geoData,
      ""
    );

    const formdata: FormData = new FormData();
    if (this.image !== undefined) {
      formdata.append("files", this.image);
      organizer["fd"] = formdata;
    } else organizer["fd"] = undefined;

    this.nullFormField();
    this.addNewOrganizer.emit(organizer);
  }

  setOrganizerFromSelection(organizer: Organizer) {
    const organizerAsAlias = this.organizerIn;
    this.organizerIn = organizer;
    this.addAlias(organizerAsAlias.name);
    this.setOrganizerForm(this.organizerIn, "true");
  }

  iconChosen(event: any) {
    if (event.target.value) {
      this.image = event.target.files[0] as File;
    }
  }

  addAlias(alias: any) {
    if (!this.organizerIn.alias) {
      this.organizerIn.alias = [alias];
    } else {
      if (this.organizerIn.alias.find((name) => name === alias)) {
        this.organizerIn.alias = this.organizerIn.alias.filter(
          (name) => name !== alias
        );
      } else this.organizerIn.alias.push(alias);
    }
  }

  setOrganizerForm(org: Organizer, isOrganizerAlias = "false"): void {
    console.log(org.category);
    const streetName = org.address?.street
      ? org.address.street + " " + org.address?.streetNumber
      : "";
    this.organizerForm.setValue({
      name: org.name,
      city: org.address.city,
      plz: org.address.plz,
      street: streetName,
      streetNumber: "",
      country: org.address.country,
      email: org.email,
      telephone: org.telephone,
      description: org.description,
      link: org.link,
      frequency: org.frequency,
      isEvent: String(org.isEvent),
      isOrganizerAlias: isOrganizerAlias,
    });
    this.category = org.category;
    this.openingTimes = org.openingTimes;
    this.updateOrganizerId = org._id;
    this.ifEventId = org.ifEventId;
    this.geoData = org.geoData;
  }

  nullFormField() {
    this.isOpeningTimesRequired = false;
    this.organizerForm = this.fb.group(getOrganizerFormTemplate());

    this.openingTimes = getOpeningTimesTemplate();
    this.category = undefined;
    this.updateOrganizerId = "";
    this.ifEventId = "";
    this.inputImage.nativeElement.value = "";
    this.organizerIn = undefined;
  }

  checkDisabled() {
    return !(!this.organizerForm.invalid && this.category !== undefined);
  }

  setCategory(category) {
    console.log("Select", category);
    this.category = category;
  }
}
