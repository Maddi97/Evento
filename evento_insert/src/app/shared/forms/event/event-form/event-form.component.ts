// import packages
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

// import models
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";

// import services
import { NominatimGeoService } from "@shared/services/location/nominatim-geo.service";

// import helper functions
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EventAdditionalInformationFormComponent } from "@forms/event/event-additional-information-form/event-additional-information-form.component";
import { EventDatesFormComponent } from "@forms/event/event-dates-form/event-dates-form.component";
import { EventFeatureFlagsFormComponent } from "@forms/event/event-feature-flags-form/event-feature-flags-form.component";
import { EventTimesFormComponent } from "@forms/event/event-times-form/event-times-form.component";
import { AddressFormComponent } from "@forms/shared/address-form/address-form.component";
import { CategorySelectComponent } from "@forms/shared/category-select/category-select.component";
import { AutocompleteOrganizerComponent } from "@shared/atoms/autocomplete-organizer/autocomplete-organizer.component";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { FormSubmitionButtonsComponent } from "@shared/forms/shared/form-submition-buttons/form-submition-buttons.component";
import { SelectFilesFormComponent } from "@shared/forms/shared/select-files-form/select-files-form.component";
import { getEventFromForm } from "@shared/logic/event.helpers";
@Component({
  selector: "app-event-form",
  standalone: true,
  imports: [
    CommonModule,
    SelectionListComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CategorySelectComponent,
    AddressFormComponent,
    EventAdditionalInformationFormComponent,
    AutocompleteOrganizerComponent,
    EventDatesFormComponent,
    EventTimesFormComponent,
    SelectFilesFormComponent,
    EventFeatureFlagsFormComponent,
    FormSubmitionButtonsComponent,
  ],
  templateUrl: "./event-form.component.html",
  styleUrls: ["./event-form.component.css"],
})
export class EventFormComponent implements OnChanges {
  @Input() eventIn: Event;
  @Input() organizersIn: Organizer[];
  @Input() page: "crawler" | "insert" = "insert";
  @Output() updateEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() addNewEvent: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild("imageUpload") inputImage: ElementRef;

  updateOrganizerId = "";
  updateEventId = "";

  eventForm: FormGroup;
  constructor(private geoService: NominatimGeoService) {
    this.eventForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      _organizerId: new FormControl("", [Validators.required]),
      organizerName: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit() {
    console.log(this.eventForm.value);
  }
  ngOnChanges(): void {
    console.log(this.eventIn);
    if (this.eventIn !== undefined) {
      this.setEventForm();
    }
  }

  submitForm() {
    if (this.updateEventId) {
      this.emitUpdateEvent();
    } else {
      this.emitAddNewEvent();
    }
  }

  async emitAddNewEvent() {
    const event = getEventFromForm(this.eventForm, this.updateEventId);
    const address = event.address;

    if (this.eventForm.get("address").value) {
      try {
        // first fetch geo data from osm API and than emit event data
        event.coordinates = await this.geoService.getCoordinates(
          address.city,
          address.street
        );
      } catch (err) {
        throw err;
      }
    } else if (this.eventForm.get("coordinates").value) {
      try {
        event.coordinates = await this.geoService.getAddressFromCoordinates(
          event.coordinates
        );
      } catch (err) {
        throw err;
      }
    }
    this.addNewEvent.emit(event);
    this.resetForm();
  }

  async emitUpdateEvent() {
    const event = getEventFromForm(this.eventForm, this.updateEventId);

    if (event.address) {
      try {
        const coordinates: any = await this.geoService.getCoordinates(
          event.address.city,
          event.address.street
        );
        event.coordinates = coordinates;
      } catch (err) {
        throw err;
      }
    } else if (event.coordinates.lat && event.coordinates.lon) {
      try {
        const geoJSON: any = await this.geoService.getAddressFromCoordinates(
          event.coordinates
        );
        event.address.plz = geoJSON.address.postcode;
        event.address.street = geoJSON.address.road;
        // Assuming the 'country' control exists in the 'eventForm'
        event.address.country = this.eventForm.get("country").value;
      } catch (err) {
        throw err;
      }
    }
    this.updateEvent.emit(event);

    this.resetForm();
  }

  setEventForm(): void {
    // Timeout is needed to register child components
    setTimeout(() => {
      this.updateEventId = this.eventIn._id;
      this.eventForm.patchValue(this.eventIn);
      this.eventForm.get("organizerName").setValue(this.eventIn.organizerName);
      this.eventForm.get("_organizerId").setValue(this.eventIn._organizerId);
      console.log(this.eventForm);
    }, 100);
  }

  insertInformationFromOrganizer(organizer: Organizer) {
    this.eventForm.get("organizerName").setValue(organizer.name);
    this.eventForm.get("_organizerId").setValue(organizer._id);
    this.eventForm.get("description").setValue(organizer.description);
    this.eventForm.get("category").setValue(organizer.category);
    this.eventForm.get("address").setValue(organizer.address);
  }

  resetForm() {
    this.updateEventId = undefined;
    this.eventIn = undefined;
    this.eventForm.reset(new Event());
  }
}
