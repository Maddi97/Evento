import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { OrganizerService } from 'src/app/services/organizer.web.service';

@Component({
    selector: 'app-selection-view',
    templateUrl: './selection-view.component.html',
    styleUrls: ['./selection-view.component.css']
})
export class SelectionViewComponent implements OnInit {

    constructor(
        private organizerService: OrganizerService,
        private categoryService: CategoryService,
    ) {
    }

    ngOnInit(): void {
        this.organizerService.getOrganizer().subscribe();
        this.categoryService.getCategories().subscribe();
    }
}
