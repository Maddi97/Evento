import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import Organizer from 'src/app/models/organizer';

@Component({
  selector: 'app-organizer-view',
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit {

  organizer: Organizer[] = [];

  constructor(private organizerService: OrganizerService) { }

  ngOnInit(): void {
    this.organizerService.getOrganizer()
    .subscribe((organizor: Organizer[]) => {
      this.organizer = organizor;
      console.log(organizor)
    }); //(organizor: Organizer[]) => this.organizer = organizor
  }
  

  addNewOrganizer(title): void {
    this.organizerService.createOrganizer(title)
    .subscribe((organizor: Organizer) => this.organizer.push(organizor));
  }
  
  deleteOrganizor(id: string){
    this.organizerService.deleteOrganizer(id)
    .subscribe(organizor => console.log(organizor));


  }
  
}
