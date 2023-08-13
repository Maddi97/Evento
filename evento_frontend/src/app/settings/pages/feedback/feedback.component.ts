import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpRequest} from '@angular/common/http';
import {WebService} from "../../../web.service";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm = this.fb.group({
    name: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    mail: new UntypedFormControl('', [Validators.email, Validators.required]),
    reason: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    description: new UntypedFormControl('', [Validators.required, Validators.minLength(5)]),
  })

  constructor(private fb: UntypedFormBuilder,
              private _snackbar: MatSnackBar,
              private webService: WebService,
  ) {
  }

  ngOnInit(): void {
  }

  submitEvent(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.get('name').markAsTouched();
      this.feedbackForm.get('mail').markAsTouched();
      this.feedbackForm.get('reason').markAsTouched();
      this.feedbackForm.get('description').markAsTouched();

    }

    if (this.feedbackForm.invalid) {
      this.openSnackBar('Im Formular sind Fehler enthalten', 'error')
    } else {
      const feedback = {
        name: this.feedbackForm.get('name').value,
        mail: this.feedbackForm.get('mail').value,
        reason: this.feedbackForm.get('reason').value,
        description: this.feedbackForm.get('description').value,
      }
      this.webService.post('sendFeedback', feedback).subscribe(
        () => console.log,
        error => {
          this.openSnackBar('Fehler beim senden! Bitte nochmal probieren', 'error')
        },
        () => {
          this.openSnackBar('Nachricht erfolgreich gesendet!', 'success')
        }
      )
      this.openSnackBar('Nachricht erfolgreich gesendet!', 'success')
      this.resetFormGroup()
    }
  }

  resetFormGroup(): void {
    this.feedbackForm = this.fb.group({
      name: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
      mail: new UntypedFormControl('', [Validators.email, Validators.required]),
      reason: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
      description: new UntypedFormControl('', [Validators.required, Validators.minLength(5)]),
    })
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

    });
  }

}
