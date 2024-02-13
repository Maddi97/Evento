import { CommonModule, isPlatformServer } from "@angular/common";
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import { FileService } from "@services/complex/files/file.service";
import { OrganizerService } from "@services/simple/organizer/organizer.service";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { map, take, tap } from "rxjs";

@Component({
  selector: "app-event-picture",
  standalone: true,
  imports: [LazyLoadImageModule, CommonModule],
  templateUrl: "./event-picture.component.html",
  styleUrls: ["./event-picture.component.css"],
})
export class EventPictureComponent implements OnInit {
  @Input() event: Event;
  @Input() organizer: Organizer;
  category;
  IconURL = null;
  ImageURL = null;
  private downloadedImage = false;

  public fileService$;

  isPlatformServer;
  constructor(
    private fileService: FileService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformServer = isPlatformServer(this.platformId);
    this.category = this.event.category;
    if (!this.isPlatformServer) {
      this.downloadImage();
    }
  }
  downloadImageIfNotExists(imagePath: string, temporaryURL: any) {
    if (
      !this.downloadedImage &&
      imagePath !== undefined &&
      temporaryURL === undefined
    ) {
      this.downloadedImage = true;
      this.fileService$ = this.fileService.downloadFile(imagePath).pipe(
        take(1),
        map((imageData) => {
          return URL.createObjectURL(imageData);
        })
      );
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
