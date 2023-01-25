import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Event} from '../../models/event';
import {DomSanitizer} from '@angular/platform-browser';
import {FileService} from '../../file.service';
import {OrganizerService} from '../../organizer.service';


@Component({
  selector: 'vents-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit, OnChanges {

  @Input() event: Event;
  @Input() distance;

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
    this.distance = Math.round(this.distance * 100) / 100 // 2 decimals
  }

  ngOnChanges() {
    this.distance = Math.round(this.distance * 100) / 100 // 2 decimals
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
    } else if (this.organizer.organizerImagePath !== undefined) {
      if (this.organizer.organizerImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.organizer.organizerImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    } else if (this.event.category.subcategories[0]?.stockImagePath !== undefined) {
      if (this.event.category.subcategories[0]?.stockImageTemporaryURL === undefined) {
        this.fileService.downloadFile(this.event.category.subcategories[0]?.stockImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    } else if (cat.stockImagePath !== undefined) {
      if (cat.stockImageTemporaryURL === undefined) {
        this.fileService.downloadFile(cat.stockImagePath).subscribe(imageData => {
          // create temporary Url for the downloaded image and bypass security
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        });
      }
    } else if (cat.iconPath !== undefined) {
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
