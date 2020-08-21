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
    this.organizerService.organizers.subscribe(o => {
      this.organizer = o;
    });
  }

  addNewOrganizer(title: string): void {
    this.organizerService.createOrganizer(title).subscribe();
  }

  deleteOrganizer(id: string): void {
    this.organizerService.deleteOrganizer(id).subscribe();
  }

}
