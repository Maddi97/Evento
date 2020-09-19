import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress, Day } from 'src/app/models/organizer';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Category } from 'src/app/models/category';

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
    city: new FormControl('Dresden', []),
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

    category: Category;

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
    // set adress
    adress.plz =  this.organizerForm.get('plz').value;
    adress.city =  this.organizerForm.get('city').value;
    adress.street =  this.organizerForm.get('street').value;
    adress.streetNumber =  this.organizerForm.get('streetNumber').value;
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
    this.organizerService.createOrganizer(org).subscribe();
    this.nullFormField();
  }



  setOrganizerForm(org: Organizer): void {
    this.organizerForm.setValue({
      name: org.name,
      city: org.adress.city,
      plz: org.adress.plz,
      street: org.adress.street,
      streetNumber: org.adress.streetNumber,
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

  updateOrganizer(): void {
      const org = new Organizer();
      const adress = new Adress();
      org.name = this.organizerForm.get('name').value;
      // set adress
      adress.plz =  this.organizerForm.get('plz').value;
      adress.city =  this.organizerForm.get('city').value;
      adress.street =  this.organizerForm.get('street').value;
      adress.streetNumber =  this.organizerForm.get('streetNumber').value;
      adress.country =  this.organizerForm.get('country').value;

      org.adress = adress

      org.email = this.organizerForm.get('email').value;
      org.telephone = this.organizerForm.get('telephone').value;
      org.description = this.organizerForm.get('description').value;
      org.link = this.organizerForm.get('link').value;
      org.frequency = this.organizerForm.get('frequency').value;
      org.category = this.category;

      org.openingTimes=this.openingTimes


     this.organizerService.updateOrganizer(this.updateOrganizerId, org).subscribe();
     this.nullFormField();

  }

  nullFormField(){
    this.organizerForm.setValue({
      name : '',
      city : 'Dresden',
      plz  : '',
      street: '',
      streetNumber: '',
      country: 'Deutschland',
      email: '',
      telephone: '',
      description: '',
      link:'',
      frequency: 7,
    });
    this.updateOrganizerId = ''
  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
