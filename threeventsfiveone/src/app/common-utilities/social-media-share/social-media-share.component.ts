import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'vents-social-media-share',
  templateUrl: './social-media-share.component.html',
  styleUrls: ['./social-media-share.component.css']
})
export class SocialMediaShareComponent implements OnInit {

  url: string = window.location.href;
  shareText = 'Schau dir dieses Event an, dass ich auf 3vents51 gefunden habe!';
  whatsappLink = encodeURI('WhatsApp://send?text=' + this.shareText + '\n' + this.url);

  constructor(private _snackbar: MatSnackBar,
              private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {

  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openSnackBar(message) {
    console.log(message)
    this._snackbar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['green-snackbar'],

    });
  }

}
