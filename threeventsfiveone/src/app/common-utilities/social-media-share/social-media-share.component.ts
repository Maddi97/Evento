import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vents-social-media-share',
  templateUrl: './social-media-share.component.html',
  styleUrls: ['./social-media-share.component.css']
})
export class SocialMediaShareComponent implements OnInit {

  url: String = window.location.href;
  shareText: String = 'Schau dir dieses Event an, dass ich auf 3vents51 gefunden habe!'
  ;

  constructor(private _snackbar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {

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
