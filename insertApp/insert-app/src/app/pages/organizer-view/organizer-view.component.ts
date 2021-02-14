import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress, Day } from 'src/app/models/organizer';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Category } from 'src/app/models/category';
import {MatSnackBar} from '@angular/material/snack-bar'
import { NominatimGeoService } from '../../nominatim-geo.service'
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-organizer-view',
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit {

  organizer: Organizer[] = [];

  updateOrganizerId: string = '';

  organizerForm = this.fb.group({
    name: new FormControl('', []),
    city: new FormControl('Leipzig', []),
    plz: new FormControl('', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    country: new FormControl('Deutschland', []),
    email: new FormControl('', []),
    telephone: new FormControl('', []),
    description: new FormControl('', []),
    link: new FormControl('', []),
    frequency: new FormControl(7, [])
  })

  isOpeningTimesRequired = false;

  openingTimes : Day[] = [
    {day: 'Monday', start: '00:00', end: '00:00'},
    {day: 'Tuesday', start: '00:00', end: '00:00'},
    {day: 'Wednesday', start: '00:00', end: '00:00'},
    {day: 'Thursday', start: '00:00', end: '00:00'},
    {day: 'Friday', start: '00:00', end: '00:00'},
    {day: 'Saturday', start: '00:00', end: '00:00'},
    {day: 'Sunday', start: '00:00', end: '00:00'}
  ]
    geo_data = {
        lat:  "",
        lon: ""
      }
    category: Category;

  constructor(
    private organizerService: OrganizerService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private geoService: NominatimGeoService,
    ) { }

  ngOnInit(): void {
    this.organizerService.organizers.subscribe(o => {
      this.organizer = o;
    });
  }



  addNewOrganizer(): void {
    const org = new Organizer();
    const adress = new Adress();
    org.name = this.organizerForm.get('name').value;
    // set adress
    adress.plz =  this.organizerForm.get('plz').value;
    adress.city =  this.organizerForm.get('city').value;
    adress.street =  this.organizerForm.get('street').value.split(' ').slice(0,-1).join(' ');
    adress.streetNumber =  this.organizerForm.get('street').value.split(' ').slice(-1)[0];
    adress.country =  this.organizerForm.get('country').value;

    org.adress = adress

    org.email = this.organizerForm.get('email').value;
    org.telephone = this.organizerForm.get('telephone').value;
    org.description = this.organizerForm.get('description').value;
    org.link = this.organizerForm.get('link').value;
    org.frequency = this.organizerForm.get('frequency').value;
    org.category = this.category;
    //this.organizerForm.get('category').value;

    org.openingTimes=this.openingTimes
    org.lastUpdated = new Date()

    org.geo_data = this.geo_data

    // first fetch geo data from osm API and than complete event data type and send to backend
    this.geoService.get_geo_data(adress.city, adress.street, adress.streetNumber).pipe(
      map(geo_data => {
      org.geo_data.lat = geo_data[0].lat;
      org.geo_data.lon = geo_data[0].lon;
      }),
      share()
      ).toPromise().then( undefined =>
      {  
        this.organizerService.createOrganizer(org).subscribe(res => { this.openSnackBar("Successfully updated: "+ res.name) })
        this.organizerForm.reset()
      }

        )


    this.nullFormField();
  }



  setOrganizerForm(org: Organizer): void {
    this.organizerForm.setValue({
      name: org.name,
      city: org.adress.city,
      plz: org.adress.plz,
      street: org.adress.street + ' ' + org.adress.streetNumber ,
      streetNumber: '' ,
      country: org.adress.country,
      email: org.email,
      telephone: org.telephone,
      description: org.description,
      link: org.link,
      frequency: org.frequency
  });

    this.category = org.category
    this.openingTimes = org.openingTimes
    this.updateOrganizerId = org._id;

  }

  setCategory(category){
    this.category = category
  }

  updateOrganizer(): void {
      const org = new Organizer();
      const adress = new Adress();

      org._id = this.updateOrganizerId;
      org.name = this.organizerForm.get('name').value;
      // set adress
      adress.plz =  this.organizerForm.get('plz').value;
      adress.city =  this.organizerForm.get('city').value;
      adress.street =  this.organizerForm.get('street').value.split(' ').slice(0,-1).join(' ');
      adress.streetNumber =  this.organizerForm.get('street').value.split(' ').slice(-1)[0];
      adress.country =  this.organizerForm.get('country').value;

      org.adress = adress

      org.email = this.organizerForm.get('email').value;
      org.telephone = this.organizerForm.get('telephone').value;
      org.description = this.organizerForm.get('description').value;
      org.link = this.organizerForm.get('link').value;
      org.frequency = this.organizerForm.get('frequency').value;
      org.category = this.category;

      org.openingTimes=this.openingTimes
      org.geo_data = this.geo_data
    // first fetch geo data from osm API and than complete event data type and send to backend
    this.geoService.get_geo_data(adress.city, adress.street, adress.streetNumber).pipe(
      map(geo_data => {
      org.geo_data.lat = geo_data[0].lat;
      org.geo_data.lon = geo_data[0].lon;
      }),
      share()
      ).toPromise().then( undefined =>
      {  
        this.organizerService.updateOrganizer(org._id, org).subscribe(
        res => this.openSnackBar("Successfully updated: "+ res.name));
        this.organizerForm.reset()
      }

        )

     
     this.nullFormField();


  }

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

    this.openingTimes = [
      {day: 'Monday', start: '00:00', end: '00:00'},
      {day: 'Tuesday', start: '00:00', end: '00:00'},
      {day: 'Wednesday', start: '00:00', end: '00:00'},
      {day: 'Thursday', start: '00:00', end: '00:00'},
      {day: 'Friday', start: '00:00', end: '00:00'},
      {day: 'Saturday', start: '00:00', end: '00:00'},
      {day: 'Sunday', start: '00:00', end: '00:00'}
    ]
    this.category = new Category()
    this.updateOrganizerId = ''
  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
