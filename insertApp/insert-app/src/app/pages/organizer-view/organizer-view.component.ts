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
    city: new FormControl('', []),
    plz: new FormControl('', []),
    street: new FormControl('', []),
    streetNumber: new FormControl('', []),
    country: new FormControl('', []),
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
    org.name = this.organizerForm.get('name').value;
    console.log(org);
    this.organizerService.createOrganizer(org).subscribe();
  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
