import { isPlatformServer } from "@angular/common";
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Event } from "@globals/models/event";
import { FileService } from "@services/complex/files/file.service";
import { OrganizerService } from "@services/simple/organizer/organizer.service";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { take, tap } from "rxjs";

@Component({
  selector: "app-event-picture",
  standalone: true,
  imports: [LazyLoadImageModule],
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
  organizer;
  constructor(
    private fileService: FileService,
    private organizerService: OrganizerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformServer = isPlatformServer(this.platformId);
    this.category = this.event.category;
    if (!this.isPlatformServer) {
      this.organizerService
        .getOrganizerById(this.event._organizerId)
        .pipe(
          take(1),
          tap((organizer) => (this.organizer = organizer[0]))
        )
        .subscribe({
          complete: () => {
            this.downloadImage();
          },
        });
    }
  }
  ngOnDestroy() {
    if (this.fileService$) {
      console.log("Destroy file service");
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
      this.fileService$ = this.fileService
        .downloadFile(imagePath)
        .pipe(take(1))
        .subscribe({
          next: (imageData) => {
            this.ImageURL = URL.createObjectURL(imageData);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.fileService$.unsubscribe();
            //console.log("Image download complete");
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
    ),
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
