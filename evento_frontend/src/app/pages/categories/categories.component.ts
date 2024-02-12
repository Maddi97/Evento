import { Component, OnInit, OnDestroy } from "@angular/core";
import { Category } from "../../globals/models/category";
import { CategoriesService } from "../../services/simple/categories/categories.service";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { CategoryTileComponent } from "@shared/molecules/category-tile/category-tile.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, CategoryTileComponent],
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {
  categoryList: Category[] = [];
  category$;

  constructor(private categoriesService: CategoriesService) {}
  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categoryList = categories;
      },
      error: (error) => {
        // Handle error here
        console.error("An error occurred while fetching categories", error);
      },
      complete: () => {
        console.log("Complete categories");
      },
    });
  }
}
