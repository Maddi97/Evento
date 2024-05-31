import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private _snackbar: MatSnackBar) {}

  openSnackBar(message, state: "success" | "error", duration = 1500) {
    this._snackbar.open(message, "", {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: [state !== "error" ? "green-snackbar" : "red-snackbar"],
    });
  }
}
