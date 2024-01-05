import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.css']
})
export class SelectionListComponent {
  @Input() namesList: string[] = [];
  @Input() listTitle: string = '';
  @Output() updatedNamesList = new EventEmitter<string[]>();

  deleteName(name: string): void {
    this.namesList = this.namesList.filter(item => item !== name);
    this.updatedNamesList.emit(this.namesList);
  }
}
