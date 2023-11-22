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
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import * as moment from "moment";
import { catchError, map } from "rxjs/operators";

// import models
import { Category } from "../../../models/category";
import { Event } from "../../../models/event";
import { Organizer } from "../../../models/organizer";

// import services
import { NominatimGeoService } from "../../../services/location/nominatim-geo.service";
import { OrganizerService } from "../../../services/organizer.web.service";

// import helper functions
import { MatSnackBar } from "@angular/material/snack-bar";
import { getEventFormTemplate, getEventFromForm } from "../event.helpers";

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
  isHot = false
  hasUnkownOpeningTimes = false;
  isPromotion = false;
  isPermanent = "false";

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
    if (this.eventIn !== undefined) {
      this.setEventForm();
    }
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
      this.updateEventId,
      this.isHot,
      this.isPromotion,
      this.hasUnkownOpeningTimes,
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
            event.geoData = geoData
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
      this.updateEventId,
      this.isHot,
      this.isPromotion,
      this.hasUnkownOpeningTimes,

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
            event.geoData = geoData;
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
    const start: any = this.eventIn?.date?.start ? moment(this.eventIn.date.start).toDate() : '';
    const end: any = this.eventIn?.date?.end ? moment(this.eventIn.date.end).toDate() : '';
    const organizer = this.organizersIn.find(
      (org) => org._id === this.eventIn._organizerId
    );
    this.organizerName.setValue(organizer.name);
    this.updateOrganizerId = organizer._id;
    const streetName = this.eventIn.address?.street ? this.eventIn.address.street + " " + this.eventIn.address?.streetNumber : ''

    const eventFormValues = {
      name: this.eventIn.name || '',
      city: this.eventIn.address.city || '',
      plz: this.eventIn.address.plz || '',
      street:
        streetName,
      streetNumber: this.eventIn.address.streetNumber || '',
      country: this.eventIn.address.country || '',
      description: this.eventIn.description || '',
      link: this.eventIn.link || '',
      permanent: String(this.eventIn.permanent),
      price: this.eventIn.price || '',
      coord: this.eventIn.geoData.lat || '' + ", " + this.eventIn.geoData.lon || '',
    }
    if (!this.eventIn.permanent) {
      eventFormValues['start'] = start;
      eventFormValues['end'] = end;
    }
    else {
      this.eventForm.removeControl("start");
      this.eventForm.removeControl("end");
    }
    this.times.start.setValue(this.eventIn.times.start)
    this.times.end.setValue(this.eventIn.times.end)

    this.eventForm.setValue(eventFormValues);
    this.category = this.eventIn.category;
    this.isHot = this.eventIn.hot
    this.hasUnkownOpeningTimes = this.eventIn.hasUnkownOpeningTimes;
    this.isPromotion = this.eventIn.promotion;
  }

  insertOrgInfo(org: Organizer) {
    this.eventForm.get("plz").setValue(org.address.plz);
    this.eventForm.get("city").setValue(org.address.city);
    this.eventForm
      .get("street")
      .setValue(org.address.street + " " + org.address.streetNumber);
    // set category to organizers category but leave subcat empty
    this.eventForm.get("description").setValue(org.description)
    const cat = org.category;
    cat.subcategories = [];
    this.category = cat;

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
    this.isHot = false;
    this.hasUnkownOpeningTimes = false;
    this.isPromotion = false;
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
  isPermanentChange() {
    this.isPermanent = this.eventForm.get("permanent").value;
    if (this.isPermanent === "true") {
      this.eventForm.removeControl("start");
      this.eventForm.removeControl("end");

    }
    else {
      this.eventForm.addControl('start', this.fb.control('', [Validators.required]))
      this.eventForm.addControl('end', this.fb.control('', [Validators.required]))
    }
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
