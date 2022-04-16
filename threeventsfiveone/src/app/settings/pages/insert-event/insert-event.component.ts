import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar";

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
      this.openSnackBar()
    } else {
      const event = {
        name: this.eventForm.get('eventName').value,
        organizerName: this.eventForm.get('organizerName').value,
        adress: this.eventForm.get('adress').value,
        link: this.eventForm.get('link').value,
        description: this.eventForm.get('description').value,
      }
      console.log(event)
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

  openSnackBar() {
    this._snackbar.open('Im Formular sind Fehler enthalten.', '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: 'red-snackbar'

    });
  }

}
