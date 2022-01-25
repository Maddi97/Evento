import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer } from 'src/app/models/organizer';
import {  FormBuilder, FormControl } from '@angular/forms';
import { Category } from 'src/app/models/category';
import {MatSnackBar} from '@angular/material/snack-bar'
import { NominatimGeoService } from '../../nominatim-geo.service'
import { map, share} from 'rxjs/operators';
import * as log from 'loglevel';
import {EventsService} from "../../events.service";
import {getOpeningTimesTemplate, getGeoDataTemplate,
        getOrganizerFormTemplate, transformFormFieldToOrganizer,
        createEventFromOrg} from "./organizer.helpers"

@Component({
  selector: 'app-organizer-view',
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit {

  organizer: Organizer[] = [];
  updateOrganizerId: string = '';
  ifEventid: string = '';
  isOpeningTimesRequired = false;
  category: Category;

  //sunscriptions
  organizer$;
  createOrganizer$;
  updateOrganizer$;
  deleteOrganizer$;

  organizerForm = this.fb.group(getOrganizerFormTemplate())
  openingTimes = getOpeningTimesTemplate()
  geo_data = getGeoDataTemplate()

  constructor(
    private organizerService: OrganizerService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private geoService: NominatimGeoService,
    private eventService: EventsService,

  ) { }

  ngOnInit(): void {
    this.organizer$ = this.organizerService.organizers.
      pipe(
        map( o => {
         this.organizer = o;
                  }
            )
        );
    this.organizer$.subscribe()
  }

  ngOnDestroy(): void{
      this.organizer$.unsubscribe();

  }

  addNewOrganizer(): void {
      //create organizerObject From FormField organizerForm
    const org = transformFormFieldToOrganizer(this.organizerForm, this.category, this.openingTimes, this.geo_data)
    const address = org.address

    // first fetch geo data from osm API and than complete event data type and send to backend
    this.createOrganizer$ = this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
        .pipe(
          map(
              geo_data => {
                org.geo_data.lat = geo_data[0].lat;
                org.geo_data.lon = geo_data[0].lon;

                this.organizerService.createOrganizer(org)
                    .toPromise().then(
                            res => {
                        let _id = res._id;
                        if (res.isEvent == true){
                          //if org is event than create also an event object
                          const event = createEventFromOrg(org)
                          event._organizerId = _id
                          this.eventService.createEvent(event).subscribe(
                             event => {
                                 org.ifEventid = event._id
                                 this.organizerService.updateOrganizer(_id, org).subscribe(
                                 )
                             }
                          )
                  }
                  this.openSnackBar("Successfully added: "+ res.name)
                })
                  }
               )).subscribe()

        this.nullFormField();
  }

  updateOrganizer(): void {
      const org = transformFormFieldToOrganizer(this.organizerForm, this.category, this.openingTimes ,this.geo_data)
      const address = org.address;
      org._id = this.updateOrganizerId;
      org.ifEventid = this.ifEventid

        // first fetch geo data from osm API and than complete event data type and send to backend
      this.updateOrganizer$ = this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
            .pipe(
                map(
                    geo_data => {

                        org.geo_data.lat = geo_data[0].lat;
                      org.geo_data.lon = geo_data[0].lon;
                      this.organizerService.updateOrganizer(org._id, org)
                          .toPromise().then(res =>
                                    {
                                        let _id = res._id;
                                        if (org.isEvent.toString() === "true" && res.isEvent == false )
                                        {
                                            //if org is event than create also an event object
                                            const event = createEventFromOrg(org)
                                            event._organizerId = _id
                                            this.eventService.createEvent(event).subscribe(
                                                event =>
                                                {
                                                    org.ifEventid = event._id
                                                    this.organizerService.updateOrganizer(org._id, org).subscribe(

                                                    )
                                                }
                                            )
                                        }

                                        if (org.isEvent.toString() === "false" && res.isEvent == true ) {
                                            this.eventService.deletEvent(org._id, org.ifEventid).subscribe(
                                            )
                                        }
                                            this.openSnackBar("Successfully updated: "+ res.name)
                                    }
                                )
                        }
                    ),

                ).subscribe()

      //this.updateOrganizer$.subscribe()
      this.nullFormField();

  }

    deleteOrganizer(id: string): void {
        this.deleteOrganizer$ = this.organizerService.deleteOrganizer(id)
        this.deleteOrganizer$.subscribe();
    }




    // some more helper functions


  openSnackBar(message){

    this._snackbar.open(message, '' , {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['green-snackbar']

    });
  }

  nullFormField(){
    this.isOpeningTimesRequired = false;
    this.organizerForm = this.fb.group(getOrganizerFormTemplate())

      this.openingTimes = getOpeningTimesTemplate()
    this.category = undefined
    this.updateOrganizerId = ''
      this.ifEventid = ''
  }

  checkDisabled(){
    if(!this.organizerForm.invalid && this.category !== undefined) return false
    else return true
  }
    setCategory(category){
        this.category = category
    }

    setOrganizerForm(org: Organizer): void {

        this.organizerForm.setValue({
            name: org.name,
            city: org.address.city,
            plz: org.address.plz,
            street: org.address.street + ' ' + org.address.streetNumber ,
            streetNumber: '' ,
            country: org.address.country,
            email: org.email,
            telephone: org.telephone,
            description: org.description,
            link: org.link,
            frequency: org.frequency,
            isEvent: String(org.isEvent),
        });

        this.category = org.category
        this.openingTimes = org.openingTimes
        this.updateOrganizerId = org._id;
        this.ifEventid = org.ifEventid;

    }

}
