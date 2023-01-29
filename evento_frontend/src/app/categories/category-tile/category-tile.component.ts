import {Component, OnInit, Input} from '@angular/core';
import {Category} from 'src/app/models/category';
import {DomSanitizer} from '@angular/platform-browser';
import {FileService} from '../../file.service';

@Component({
  selector: 'app-category-tile',
  templateUrl: './category-tile.component.html',
  styleUrls: ['./category-tile.component.css']
})
export class CategoryTileComponent implements OnInit {

  @Input() category: Category;

  showSubcategories = false;

  constructor(private fileService: FileService,
              private sanitizer: DomSanitizer,) {

  }

  ngOnInit(): void {
    this.downloadImage();
    this.downloadImageSubcategories();
  }

  onClick() {
    this.showSubcategories ? this.showSubcategories = false : this.showSubcategories = true;
  }


  // uses only image from category -> may change
  downloadImage() {
    const cat = this.category;
    if (cat.iconPath !== undefined) {
      if (cat.iconTemporaryURL === undefined) {
        this.fileService.downloadFile(cat.iconPath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.category.iconTemporaryURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }

    }
  }

  downloadImageSubcategories() {
    this.category.subcategories.forEach(subcategory => {
      if (subcategory.iconPath !== undefined) {
        if (subcategory.iconTemporaryURL === undefined) {
          this.fileService.downloadFile(subcategory.iconPath).subscribe(imageData => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            subcategory.iconTemporaryURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          });
        }

      }
    });
  }
}
