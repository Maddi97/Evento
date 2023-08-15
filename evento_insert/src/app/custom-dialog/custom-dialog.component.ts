import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { dateTimesFormater } from '../logic/opening-times-format-helpers';



@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent {
  continue: boolean = false;
  dateTimesFormater = dateTimesFormater;
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    dialogRef.beforeClosed().subscribe(() => dialogRef.close(this.continue));
  }

  closeDialog(data) {
    this.continue = data;
    this.dialogRef.close();
  }
}