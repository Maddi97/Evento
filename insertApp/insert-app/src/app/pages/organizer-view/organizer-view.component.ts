import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { Organizer, Adress } from 'src/app/models/organizer';

@Component({
  selector: 'app-organizer-view',
  templateUrl: './organizer-view.component.html',
  styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit {

  organizer: Organizer[] = [];

  constructor(private organizerService: OrganizerService) { }

  ngOnInit(): void {
    this.organizerService.organizers.subscribe(o => {
      this.organizer = o;
    });
  }

  addNewOrganizer(title: string): void {
    const org = new Organizer();
    org.title = title;
    org.adress = new Adress();
    org.adress.plz = '01127';
    org.adress.street = 'Großenhainerstraße';
    this.organizerService.createOrganizer(org).subscribe();
  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
