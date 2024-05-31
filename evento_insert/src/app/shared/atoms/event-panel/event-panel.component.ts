import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Event } from "../../../globals/models/event";
import { FileUploadService } from "../../../shared/services/files/file-upload.service";
@Component({
  selector: "app-event-panel",
  standalone: true,
  imports: [],
  templateUrl: "./event-panel.component.html",
  styleUrls: ["./event-panel.component.css"],
})
export class EventPanelComponent implements OnInit {
  @Input() event: Event;
  @Output() emitInputEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() emitDeleteEvent: EventEmitter<Event> = new EventEmitter<Event>();

  imageURL = null;
  constructor(
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.downloadImage();
  }

  downloadImage() {
    if (this.event.eventImagePath !== undefined) {
      if (this.event.eventImageTemporaryURL === undefined) {
        this.fileService
          .downloadFile(this.event.eventImagePath)
          .subscribe((imageData) => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            this.imageURL =
              this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            this.event.eventImageTemporaryURL = this.imageURL;
          });
      }
    }
  }
}
