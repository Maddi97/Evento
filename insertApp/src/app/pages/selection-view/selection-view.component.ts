import { Component, OnInit } from '@angular/core';
import { OrganizerService } from 'src/app/organizer.service';
import { CategoryService } from 'src/app/category.service';

@Component({
  selector: 'app-selection-view',
  templateUrl: './selection-view.component.html',
  styleUrls: ['./selection-view.component.css']
})
export class SelectionViewComponent implements OnInit {

  constructor(
    private organizerService: OrganizerService,
    private categoryService: CategoryService,
    
  ) { }

  ngOnInit(): void {
    this.organizerService.getOrganizer().subscribe();
    this.categoryService.getCategories().subscribe();
  }

}
