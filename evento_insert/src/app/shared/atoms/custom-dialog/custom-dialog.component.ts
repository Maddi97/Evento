import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { dateTimesFormater } from "../../logic/opening-times-format-helpers";

@Component({
  selector: "app-custom-dialog",
  standalone: true,
  imports: [],
  templateUrl: "./custom-dialog.component.html",
  styleUrls: ["./custom-dialog.component.css"],
})
export class CustomDialogComponent {
  continue: boolean = false;
  dateTimesFormater = dateTimesFormater;
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    dialogRef.beforeClosed().subscribe(() => dialogRef.close(this.continue));
  }

  closeDialog(data) {
    this.continue = data;
    this.dialogRef.close();
  }
}
