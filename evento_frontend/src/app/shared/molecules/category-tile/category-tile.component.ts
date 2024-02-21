import { Component, OnInit, Input, Inject, PLATFORM_ID } from "@angular/core";
import { Category } from "@globals/models/category";
import { DomSanitizer } from "@angular/platform-browser";
import { FileService } from "@services/complex/files/file.service";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { Observable, map, take } from "rxjs";

@Component({
  selector: "app-category-tile",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./category-tile.component.html",
  styleUrls: ["./category-tile.component.css"],
})
export class CategoryTileComponent implements OnInit {
  @Input() category: Category;

  showSubcategories = false;
  image$: Observable<any>;
  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.downloadImage();
      this.downloadImageSubcategories();
    }
  }

  onClick() {
    this.showSubcategories
      ? (this.showSubcategories = false)
      : (this.showSubcategories = true);
  }

  // uses only image from category -> may change
  downloadImage() {
    const cat = this.category;
    if (cat.iconPath !== undefined) {
      if (cat.iconTemporaryURL === undefined) {
        this.image$ = this.fileService.downloadFile(cat.iconPath).pipe(take(1));
      }
    }
  }

  downloadImageSubcategories() {
    this.category.subcategories.forEach((subcategory) => {
      if (subcategory.iconPath !== undefined) {
        if (subcategory.iconTemporaryURL === undefined) {
          subcategory.iconTemporaryURL = this.fileService.downloadFile(
            subcategory.iconPath
          );
        }
      }
    });
  }
}
