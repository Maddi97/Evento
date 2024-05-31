import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Category, Subcategory } from "src/app/globals/models/category";
import { FileUploadService } from "../../services/files/file-upload.service";
import { ByPassSecurityPipe } from "../../pipes/BypassSecurity.pipe";
@Component({
  selector: "app-category-image",
  standalone: true,
  imports: [ByPassSecurityPipe],
  templateUrl: "./category-image.component.html",
  styleUrl: "./category-image.component.css",
})
export class CategoryImageComponent implements OnChanges {
  @Input({ required: true }) imagePath: "string";
  temporaryUrl: string;

  constructor(private fileService: FileUploadService) {}
  ngOnChanges(): void {
    this.downloadImage();
  }
  downloadImage() {
    if (this.imagePath) {
      this.fileService
        .downloadFile(this.imagePath)
        .subscribe((imageData: Blob) => {
          this.temporaryUrl = URL.createObjectURL(imageData);
        });
    }
  }
}
