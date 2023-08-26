// import packages
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
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { catchError, map, share } from "rxjs/operators";
import * as moment from "moment";

// import models
import { Organizer } from "../../../models/organizer";
import { Category, Subcategory } from "../../../models/category";
import { Event } from "../../../models/event";

// import services
import { NominatimGeoService } from "../../../services/nominatim-geo.service";
import { OrganizerService } from "../../../services/organizer.service";

// import helper functions
import { getEventFormTemplate, getEventFromForm } from "../event.helpers";
import * as log from "loglevel";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-event-form",
  templateUrl: "./event-form.component.html",
  styleUrls: ["./event-form.component.css"],
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() eventIn: Event;
  @Input() organizersIn: Organizer[];

  @Output() updateEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() addNewEvent: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild("imageUpload") inputImage: ElementRef;

  updateOrganizerId = "";
  updateEventId = "";

  date = new FormControl(new Date());
  category: Category;
  toggleIsChecked = new FormControl(true);

  times = {
    start: new FormControl("00:00"),
    end: new FormControl("00:00"),
  };

  geoData = {
    lat: "",
    lon: "",
  };

  organizerName = new FormControl("", [Validators.required]);
  filteredOrganizers: Organizer[];
  image: any;
  eventForm;
  constructor(
    private fb: FormBuilder,
    private geoService: NominatimGeoService,
    private organizerService: OrganizerService,
    private _snackbar: MatSnackBar
  ) {
    this.eventForm = this.fb.group(getEventFormTemplate());

  }

  ngOnInit(): void {
    this.filteredOrganizers = this.organizersIn;
    this.organizerName.valueChanges.subscribe((oNameStart) =>
      this.filterOrganizerByName(oNameStart)
    );
  }

  ngOnChanges(): void {
    if (this.eventIn !== undefined) {
      this.setEventForm();
    }
  }

  emitAddNewEvent() {
    const organizer = this.organizersIn.find(
      (org) => org.name === this.organizerName.value
    );
    const event = getEventFromForm(
      this.eventForm,
      organizer,
      this.category,
      this.times,
      this.updateEventId
    );
    const address = event.address;
    const formdata: FormData = new FormData();
    if (this.image !== undefined) {
      formdata.append("files", this.image);
      event["fd"] = formdata;
    } else {
      event["fd"] = undefined;
    }

    if (this.toggleIsChecked.value) {
      event.geoData = this.geoData;
      // first fetch geo data from osm API and than emit event data
      this.geoService
        .get_geo_data(address.city, address.street, address.streetNumber)
        .pipe(
          map((geoData) => {
            if (Object.keys(geoData).length < 1) {
              throw new Error("No coordinates found to given address");
            }
            event.geoData.lat = geoData[0].lat;
            event.geoData.lon = geoData[0].lon;
            this.addNewEvent.emit(event);
          }),
          catchError((err) => {
            this.openSnackBar("Error: " + err, "error");
            throw err;
          })
        )
        .subscribe();
    } else {
      const coord = this.eventForm.get("coord").value;
      this.geoData.lat = coord.split(",")[0].trim();
      this.geoData.lon = coord.split(",")[1].trim();
      event.geoData = this.geoData;
      this.geoService
        .get_address_from_coordinates(this.geoData)
        .pipe(
          map((geoJSON: any) => {
            event.address.plz = geoJSON.address.postcode;
            event.address.street = geoJSON.address.road;
            // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
            event.address.country = this.eventForm.get("country").value;
            this.addNewEvent.emit(event);
          }),
          catchError((err) => {
            this.openSnackBar("Error: " + err, "error");
            throw err;
          })
        )
        .subscribe();
    }
    // geoData is observable
    organizer.lastUpdated = new Date();
    this.organizerService.updateOrganizer(organizer._id, organizer).subscribe();
    this.nullFormField();
  }

  emitUpdateEvent() {
    const organizer = this.organizersIn.find(
      (org) => org.name === this.organizerName.value
    );
    const event = getEventFromForm(
      this.eventForm,
      organizer,
      this.category,
      this.times,
      this.updateEventId
    );
    const address = event.address;

    const formdata: FormData = new FormData();
    if (this.image !== undefined) {
      formdata.append("files", this.image);
      event["fd"] = formdata;
    } else {
      event["fd"] = undefined;
    }

    if (this.toggleIsChecked.value) {
      event.geoData = this.geoData;
      this.geoService
        .get_geo_data(address.city, address.street, address.streetNumber)
        .pipe(
          map((geoData) => {
            if (Object.keys(geoData).length < 1) {
              throw new Error("No coordinates found to given address");
            }
            event.geoData.lat = geoData[0].lat;
            event.geoData.lon = geoData[0].lon;
            this.updateEvent.emit(event);
          }),
          catchError((err) => {
            this.openSnackBar("Error: " + err, "error");
            throw err;
          })
        )
        .subscribe();
    } else {
      const coord = this.eventForm.get("coord").value;
      this.geoData.lat = coord.split(",")[0].trim();
      this.geoData.lon = coord.split(",")[1].trim();
      event.geoData = this.geoData;
      this.geoService
        .get_address_from_coordinates(this.geoData)
        .pipe(
          map((geoJSON: any) => {
            event.address.plz = geoJSON.address.postcode;
            event.address.street = geoJSON.address.road;
            // name land in response ist englisch, deshalb erstmal auf Deutschland gesetzt
            event.address.country = this.eventForm.get("country").value;
            this.updateEvent.emit(event);
          }),
          catchError((err) => {
            this.openSnackBar("Error: " + err, "error");
            throw err;
          })
        )
        .subscribe();
    }

    // geoData is observable
    organizer.lastUpdated = new Date();
    this.organizerService.updateOrganizer(organizer._id, organizer).subscribe();
    this.nullFormField();
  }

  setEventForm(): void {
    // prepare dates
    this.updateEventId = this.eventIn._id;

    const start: any = moment(this.eventIn.date.start).toDate();
    const end: any = moment(this.eventIn.date.end).toDate();
    const organizer = this.organizersIn.find(
      (org) => org._id === this.eventIn._organizerId
    );
    this.organizerName.setValue(organizer.name);
    this.updateOrganizerId = organizer._id;
    this.eventForm.setValue({
      name: this.eventIn.name,
      city: this.eventIn.address.city,
      plz: this.eventIn.address.plz,
      street:
        this.eventIn.address.street + " " + this.eventIn.address.streetNumber,
      streetNumber: this.eventIn.address.streetNumber,
      country: this.eventIn.address.country,
      description: this.eventIn.description,
      link: this.eventIn.link,
      permanent: String(this.eventIn.permanent),
      price: this.eventIn.price,
      start,
      end,
      coord: this.eventIn.geoData.lat + ", " + this.eventIn.geoData.lon,
    });
    this.category = this.eventIn.category;

    this.times.start.setValue(this.eventIn.times.start);
    this.times.end.setValue(this.eventIn.times.end);
  }

  insertOrgInfo(org: Organizer) {
    this.eventForm.get("plz").setValue(org.address.plz);
    this.eventForm.get("city").setValue(org.address.city);
    this.eventForm
      .get("street")
      .setValue(org.address.street + " " + org.address.streetNumber);
  }

  iconChosen(event: any) {
    if (event.target.value) {
      this.image = event.target.files[0] as File;
    }
  }

  nullFormField() {
    this.updateEventId = "";
    this.organizerName.setValue("");
    this.organizerName.markAsUntouched();
    this.eventForm = this.fb.group(getEventFormTemplate());
    this.category = undefined;
    this.times.start.setValue("00:00");
    this.times.end.setValue("00:00");
    this.inputImage.nativeElement.value = "";
  }

  setCategory(value) {
    this.category = value;
  }

  checkDisabled() {
    return !(!this.eventForm.invalid && this.category !== undefined);
  }
  filterOrganizerByName(oNameStart) {
    this.filteredOrganizers = this.organizersIn.filter((organizer) =>
      organizer.name.toLowerCase().startsWith(oNameStart.toLowerCase())
    );
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, "", {
      duration: 1000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: [state !== "error" ? "green-snackbar" : "red-snackbar"],
    });
  }
}
