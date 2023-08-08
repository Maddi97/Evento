import {Component, Input, OnInit} from '@angular/core';
import {FileService} from "../../file.service";
import {DomSanitizer} from "@angular/platform-browser";
import {OrganizerService} from "../../organizer.service";
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-event-picture',
  templateUrl: './event-picture.component.html',
  styleUrls: ['./event-picture.component.css']
})
export class EventPictureComponent implements OnInit {

  @Input() event;
  category;
  organizer;
  IconURL = null;
  ImageURL = null;

  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private organizerService: OrganizerService,
  ) {
  }

  ngOnInit(): void {
    this.category = this.event?.category;
    this.organizerService.getOrganizerById(this.event?._organizerId).subscribe(
      organizer => {
        this.organizer = organizer
        this.downloadImage()
      }
    )
  }

  downloadImage() {

    if (this.event?.eventImagePath !== undefined) {
      if (this.event?.eventImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.event.eventImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          //this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          this.ImageURL = unsafeImg
        });
      }
    } else if (this.organizer.organizerImagePath !== undefined) {
      if (this.organizer.organizerImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.organizer.organizerImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          //this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          this.ImageURL = unsafeImg
        });
      }
    } else if (this.event.category.subcategories[0]?.stockImagePath !== undefined) {
      if (this.event.category.subcategories[0]?.stockImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.event.category.subcategories[0]?.stockImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          //this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          this.ImageURL = unsafeImg
        });
      }
    } else if (this.category.stockImagePath !== undefined) {
      if (this.category.stockImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.category.stockImagePath).pipe(debounceTime(20000)).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          //this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          this.ImageURL = unsafeImg
        });
      }
    } else if (this.category.iconPath !== undefined) {
      if (this.category.iconTemporaryURL === undefined) {
        this.fileService.downloadFile(this.category.iconPath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          //this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          this.ImageURL = unsafeImg
        });
      }

    }
  }
}
