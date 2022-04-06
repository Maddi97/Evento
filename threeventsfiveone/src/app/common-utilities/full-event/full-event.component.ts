import { Component, OnInit, Input, Inject } from '@angular/core';
import { Event } from '../../models/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/events/event.service';
import { FileService } from '../../file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';


@Component({
  selector: 'vents-full-event',
  templateUrl: './full-event.component.html',
  styleUrls: ['./full-event.component.css']
})
export class FullEventComponent implements OnInit {

  eventId: string;

  event: Event;
  IconURL = null;
  ImageURL = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
  ) {
  }


  ngOnInit(): void {
    this.route.fragment.pipe(
      map(r => {
        console.log(r)
        this.eventId = r;
        this.eventService.getEventById(this.eventId).subscribe(
          event => {
            this.event = event[0]
            this.downloadImage();
          });
      })).subscribe()
    // this.event = this.eventService.eventForId(this.eventId)

  }

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
