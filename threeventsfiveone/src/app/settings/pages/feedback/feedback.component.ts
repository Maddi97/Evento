import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'vents-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    reason: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  constructor(private fb: FormBuilder,
              private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  submitEvent(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.get('name').markAsTouched();
      this.feedbackForm.get('reason').markAsTouched();
      this.feedbackForm.get('description').markAsTouched();

    }

    if (this.feedbackForm.invalid) {
      this.openSnackBar('Im Formular sind Fehler enthalten', 'error')
    } else {
      const feedback = {
        name: this.feedbackForm.get('name').value,
        reason: this.feedbackForm.get('reason').value,
        description: this.feedbackForm.get('feedbackForm').value,
      }
      this.openSnackBar('Nachricht erfolgreich gesendet!', 'success')
      this.resetFormGroup()
    }
  }

  resetFormGroup(): void {
    this.feedbackForm = this.fb.group({
      name: new FormControl('', Validators.required),
      reason: new FormControl('', []),
      description: new FormControl('', []),
    })
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

    });
  }

}
