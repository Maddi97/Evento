import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {Share} from "@capacitor/share";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'vents-social-media-share',
  templateUrl: './social-media-share.component.html',
  styleUrls: ['./social-media-share.component.css']
})
export class SocialMediaShareComponent implements OnInit {

  url: string = window.location.href;
  shareText = 'Schau dir dieses Event an, dass ich auf 3vents51 gefunden habe!';
  whatsappLink = encodeURI(`https://wa.me?text=${encodeURIComponent(this.shareText + '/n' + this.url)}`);
  isDeviceMobile: boolean;

  constructor(private _snackbar: MatSnackBar,
              private sanitizer: DomSanitizer,
              private deviceService: DeviceDetectorService
  ) {

  }

  ngOnInit(): void {
    this.isDeviceMobile = this.deviceService.isMobile()
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async shareOnPhone() {
    await Share.share({
      title: 'Share Event',
      text: this.shareText,
      url: this.url,
      dialogTitle: 'Teile das Event mit Freunden',
    }).then(() => console.log('Sharing successful'))

  }

  openSnackBar(message) {
    this._snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['green-snackbar'],

    });
  }

}
