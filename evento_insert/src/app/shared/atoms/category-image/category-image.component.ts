import { Component, Input, OnInit } from "@angular/core";
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
export class CategoryImageComponent implements OnInit {
  @Input({ required: true }) imagePath: "string";
  temporaryUrl: string;

  constructor(private fileService: FileUploadService) {}
  ngOnInit(): void {
    //this.downloadImage();
  }
  downloadImage() {
    if (this.imagePath) {
      this.fileService
        .downloadFile(this.imagePath)
        .subscribe((imageData: Blob) => {
          this.temporaryUrl = URL.createObjectURL(imageData);
          console.log(this.temporaryUrl);
        });
    }
  }
}
