import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress, Day } from 'src/app/models/organizer';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-organizer-view',
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit {

  organizer: Organizer[] = [];

  organizerForm = this.fb.group({
    name: new FormControl('', []),
    city: new FormControl('Dresden', []),
    plz: new FormControl('01127', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    country: new FormControl('Deutschland', []),
    category: new FormControl('', []),
    description: new FormControl('', [])
  })

  isOpeningTimesRequired : boolean = false;

  openingTimes : Day[] = [
    {day: "Monday", start: "00:00", end: "00:00"},
    {day: "Tuesday", start: "00:00", end: "00:00"}, 
    {day: "Wednesday", start: "00:00", end: "00:00"}, 
    {day: "Thursday", start: "00:00", end: "00:00"}, 
    {day: "Friday", start: "00:00", end: "00:00"}, 
    {day: "Saturday", start: "00:00", end: "00:00"}, 
    {day: "Sunday", start: "00:00", end: "00:00"}  
  ]


  constructor(
    private organizerService: OrganizerService,
    private fb: FormBuilder,
    
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
    //set adress
    adress.plz =  this.organizerForm.get('plz').value;
    adress.city =  this.organizerForm.get('city').value;
    adress.street =  this.organizerForm.get('street').value;
    adress.streetNumber =  this.organizerForm.get('streetNumber').value;
    adress.country =  this.organizerForm.get('country').value;

    org.adress = adress

    org.description = this.organizerForm.get('description').value;
    org.category = this.organizerForm.get('category').value;

    org.openingTimes=this.openingTimes
    

    this.organizerService.createOrganizer(org).subscribe();
  }



  setOrganizerForm(org: Organizer): void {
    this.organizerForm.setValue({
      'name' : org.name,
      'city' : org.adress.city,
      'plz'  : org.adress.plz,
      'street': org.adress.street,
      'streetNumber': org.adress.streetNumber,
      'country': org.adress.country,
      'description': org.description,
      'category': org.category 
  });

    this.openingTimes = org.openingTimes

  }

  updateOrganizer(id: string): void {

      const org = new Organizer();
      const adress = new Adress();
      org.name = this.organizerForm.get('name').value;
      //set adress
      adress.plz =  this.organizerForm.get('plz').value;
      adress.city =  this.organizerForm.get('city').value;
      adress.street =  this.organizerForm.get('street').value;
      adress.streetNumber =  this.organizerForm.get('streetNumber').value;
      adress.country =  this.organizerForm.get('country').value;

      org.adress = adress

      org.description = this.organizerForm.get('description').value;
      org.category = this.organizerForm.get('category').value;

      org.openingTimes=this.openingTimes


     this.organizerService.updateOrganizer(id, org).subscribe();


  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }


}
