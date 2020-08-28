import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress } from 'src/app/models/organizer';
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

    console.log(org);
    this.organizerService.createOrganizer(org).subscribe();
  }



  setOrganizerForm(o: Organizer): void {
    this.organizerForm.setValue({
      'name' : o.name,
      'city' : o.adress.city,
      'plz'  : o.adress.plz,
      'street': o.adress.street,
      'streetNumber': o.adress.streetNumber,
      'country': o.adress.country,
      'description': o.description,
      'category': o.category 
  });
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

     this.organizerService.updateOrganizer(id, org).subscribe();

  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
