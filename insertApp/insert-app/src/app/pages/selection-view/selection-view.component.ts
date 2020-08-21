import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.css']
})
export class SelectionViewComponent implements OnInit {

  constructor(
    private organizerService: OrganizerService,
    
  ) { }

  ngOnInit(): void {
    this.organizerService.getOrganizer().subscribe();
  }

}
