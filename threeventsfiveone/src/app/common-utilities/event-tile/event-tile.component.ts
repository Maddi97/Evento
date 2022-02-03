import {Component, OnInit, Input} from '@angular/core';
import {Event} from '../../models/event';
import {DomSanitizer} from '@angular/platform-browser';
import {FileService} from '../../file.service';

@Component({
  selector: 'vents-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit {

  @Input() event: Event;
  IconURL = null;

  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.downloadImage();
  }


  // uses only image from category -> may change
  downloadImage() {
    const cat = this.event.category;
    if (cat.iconPath !== undefined) {
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
