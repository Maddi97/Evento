import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'vents-insert-event',
  templateUrl: './insert-event.component.html',
  styleUrls: ['./insert-event.component.css']
})
export class InsertEventComponent implements OnInit {

  eventForm = this.fb.group({
    eventName: new FormControl('', []),
    organizerName: new FormControl('', []),
    adress: new FormControl('', []),
    link: new FormControl('', []),
    description: new FormControl('', []),
  })


  constructor(private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
  }

}
