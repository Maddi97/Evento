import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar";
import {WebService} from "../../../web.service";


@Component({
  selector: 'vents-insert-event',
  templateUrl: './insert-event.component.html',
  styleUrls: ['./insert-event.component.css']
})
export class InsertEventComponent implements OnInit {

  eventForm = this.fb.group({
    eventName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    organizerName: new FormControl('', []),
    adress: new FormControl('', []),
    link: new FormControl('', []),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })


  constructor(private fb: FormBuilder,
              private _snackbar: MatSnackBar,
              private webService: WebService,
  ) {
  }

  ngOnInit(): void {
  }

  submitEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.get('eventName').markAsTouched();
      this.eventForm.get('description').markAsTouched();
    }

    if (this.eventForm.invalid) {
      this.openSnackBar('Im Formular sind Fehler enthalten.', 'error')
    } else {
      const event = {
        name: this.eventForm.get('eventName').value,
        organizerName: this.eventForm.get('organizerName').value,
        adress: this.eventForm.get('adress').value,
        link: this.eventForm.get('link').value,
        description: this.eventForm.get('description').value,
      }

      this.webService.post('sendEvent', event).subscribe(
        () => console.log,
        error => {
          this.openSnackBar('Fehler beim senden! Bitte nochmal probieren', 'error')
        },
        () => {
          this.openSnackBar('Event erfolgreich eingereicht!', 'success')
        }
      )
      this.resetFormGroup()
    }
  }

  resetFormGroup(): void {
    this.eventForm = this.fb.group({
      eventName: new FormControl('', Validators.required),
      organizerName: new FormControl('', []),
      adress: new FormControl('', []),
      link: new FormControl('', []),
      description: new FormControl('', []),
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
