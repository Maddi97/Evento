import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event';
import { DomSanitizer } from '@angular/platform-browser';
import { FileService } from '../../file.service';
import { OrganizerService } from '../../organizer.service';


@Component({
  selector: 'vents-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit {

  @Input() event: Event;
  IconURL = null;
  ImageURL = null;
  organizer = null;

  constructor(
    private fileService: FileService,
    private organizerService: OrganizerService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.organizerService.getOrganizerById(this.event._organizerId).subscribe(
      organizerResponse => {
        this.organizer = organizerResponse[0];
        this.downloadImage();
      }
    );
  }


  // uses only image from category -> may change
  downloadImage() {
    const cat = this.event.category;
    if (this.event.eventImagePath !== undefined) {
      if (this.event.eventImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.event.eventImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    }
    else if (this.organizer.organizerImagePath !== undefined) {
      if (this.organizer.organizerImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.organizer.organizerImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    }
    else if (cat.stockImagePath !== undefined) {
      if (cat.stockImageTemporaryURL === undefined) {
        this.fileService.downloadFile(cat.stockImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    }
    else if (cat.iconPath !== undefined) {
      if (cat.iconTemporaryURL === undefined) {
        this.fileService.downloadFile(cat.iconPath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.IconURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }

    }
  }


}
