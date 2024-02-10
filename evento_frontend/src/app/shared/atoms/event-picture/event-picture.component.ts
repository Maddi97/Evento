import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Event } from "@globals/models/event";
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { FileService } from "@services/complex/files/file.service";
import { OrganizerService } from "@services/simple/organizer/organizer.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-event-picture",
  templateUrl: "./event-picture.component.html",
  styleUrls: ["./event-picture.component.css"],
})
export class EventPictureComponent implements OnInit, OnDestroy {
  @Input() event: Event;
  @Input() organizerId: string;
  category;
  IconURL = null;
  ImageURL = null;
  private downloadedImage = false;

  private fileService$;

  isPlatformServer;

  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformServer = isPlatformServer(this.platformId);
    this.category = this.event.category;
    if (!this.isPlatformServer) {
      this.downloadImage();
    }
  }
  ngOnDestroy() {
    if (this.fileService$) {
      this.fileService$.unsubscribe();
    }
  }

  downloadImageIfNotExists(imagePath: string, temporaryURL: any) {
    if (
      !this.downloadedImage &&
      imagePath !== undefined &&
      temporaryURL === undefined
    ) {
      this.downloadedImage = true;
      this.fileService$ = this.fileService.downloadFile(imagePath).subscribe({
        next: (imageData) => {
          console.log("Set image URL");
          this.ImageURL = URL.createObjectURL(imageData);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("Image download complete");
        },
      });
    }
  }

  downloadImage() {
    this.downloadImageIfNotExists(
      this.event?.eventImagePath,
      this.event?.eventImageTemporaryURL
    );
    // this.downloadImageIfNotExists(
    //   this.organizerId?.organizerImagePath,
    //   this.organizerId?.organizerImageTemporaryURL
    // );
    this.downloadImageIfNotExists(
      this.event?.category.subcategories[0]?.stockImagePath,
      this.event?.category.subcategories[0]?.stockImageTemporaryURL
    );
    this.downloadImageIfNotExists(
      this.category?.stockImagePath,
      this.category?.stockImageTemporaryURL
    );
    this.downloadImageIfNotExists(
      this.category?.iconPath,
      this.category?.iconTemporaryURL
    );
  }
}
