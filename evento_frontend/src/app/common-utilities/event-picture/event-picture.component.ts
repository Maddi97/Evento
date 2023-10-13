import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileService } from "../../file.service";
import { OrganizerService } from "../../organizer.service";


@Component({
  selector: 'app-event-picture',
  templateUrl: './event-picture.component.html',
  styleUrls: ['./event-picture.component.css']
})
export class EventPictureComponent implements OnInit, OnDestroy {

  @Input() event;
  category;
  organizer;
  IconURL = null;
  ImageURL = null;
  private downloadedImage = false;

  private organizer$;
  private fileService$;

  constructor(
    private fileService: FileService,
    private organizerService: OrganizerService,
  ) {
  }

  ngOnInit(): void {
    this.category = this.event?.category;
    this.organizer$ = this.organizerService.getOrganizerById(this.event?._organizerId).subscribe(
      organizer => {
        this.organizer = organizer[0]
        this.downloadImage()
      }
    )
  }
  ngOnDestroy() {
    if (this.organizer$) {
      this.organizer$.unsubscribe();
    }
    if (this.fileService$) {
      this.fileService$.unsubscribe()
    }
  }

  downloadImageIfNotExists(imagePath: string, temporaryURL: string) {
    if (!this.downloadedImage && imagePath !== undefined && temporaryURL === undefined) {
      this.downloadedImage = true
      this.fileService$ = this.fileService.downloadFile(imagePath).subscribe({
        next: (imageData) => {
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = unsafeImg;
        },
        error: (error) => { console.log(error); },
        complete: () => { console.log('Image download complete'); }
      });
    }
  }

  downloadImage() {
    this.downloadImageIfNotExists(this.event?.eventImagePath, this.event?.eventImageTemporaryURL);
    this.downloadImageIfNotExists(this.organizer?.organizerImagePath, this.organizer?.organizerImageTemporaryURL);
    this.downloadImageIfNotExists(this.event?.category.subcategories[0]?.stockImagePath, this.event?.category.subcategories[0]?.stockImageTemporaryURL);
    this.downloadImageIfNotExists(this.category?.stockImagePath, this.category?.stockImageTemporaryURL);
    this.downloadImageIfNotExists(this.category?.iconPath, this.category?.iconTemporaryURL);
  }

}
