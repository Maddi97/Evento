import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { CategoryService } from "@shared/services/category/category.service";
import { OrganizerService } from "@shared/services/organizer/organizer.web.service";

@Component({
  selector: "app-selection-view",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatButtonModule,
  ],
  templateUrl: "./selection-view.component.html",
  styleUrls: ["./selection-view.component.css"],
})
export class SelectionViewComponent implements OnInit {
  constructor(
    private organizerService: OrganizerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.organizerService.getOrganizer().subscribe();
    this.categoryService.getCategories().subscribe();
  }
}
