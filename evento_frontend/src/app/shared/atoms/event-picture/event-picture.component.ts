import { isPlatformBrowser, isPlatformServer } from "@angular/common";
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

@Component({
  selector: "app-event-picture",
  templateUrl: "./event-picture.component.html",
  styleUrls: ["./event-picture.component.css"],
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

  isPlatformServer;

  constructor(
    private fileService: FileService,
    private organizerService: OrganizerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformServer = isPlatformServer(this.platformId);
    this.category = this.event?.category;
    this.organizer$ = this.organizerService
      .getOrganizerById(this.event?._organizerId)
      .subscribe((organizer) => {
        this.organizer = organizer[0];
        if (isPlatformBrowser(this.platformId)) {
          this.downloadImage();
        }
      });
  }
  ngOnDestroy() {
    if (this.organizer$) {
      this.organizer$.unsubscribe();
    }
    if (this.fileService$) {
      this.fileService$.unsubscribe();
    }
  }

  downloadImageIfNotExists(imagePath: string, temporaryURL: string) {
    if (
      !this.downloadedImage &&
      imagePath !== undefined &&
      temporaryURL === undefined
    ) {
      this.downloadedImage = true;
      this.fileService$ = this.fileService.downloadFile(imagePath).subscribe({
        next: (imageData) => {
          const unsafeImg = URL.createObjectURL(imageData);
          this.ImageURL = unsafeImg;
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
    this.downloadImageIfNotExists(
      this.organizer?.organizerImagePath,
      this.organizer?.organizerImageTemporaryURL
    );
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