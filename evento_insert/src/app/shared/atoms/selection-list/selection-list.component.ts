import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-selection-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selection-list.component.html",
  styleUrls: ["./selection-list.component.css"],
})
export class SelectionListComponent {
  @Input() namesList: string[] = [];
  @Input() listTitle: string = "";
  @Output() updatedNamesList = new EventEmitter<string[]>();

  deleteName(name: string): void {
    const index = this.namesList.indexOf(name);
    if (index !== -1) {
      this.namesList.splice(index, 1);
    }
    this.updatedNamesList.emit(this.namesList);
  }
}
