import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-form-submition-buttons",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./form-submition-buttons.component.html",
  styleUrl: "./form-submition-buttons.component.css",
})
export class FormSubmitionButtonsComponent {
  @Input() confirmButtonLabel: string;
  @Input() confirmFunction: () => {};
  @Input() isDisabled = false;
  @Input() isCrawledSet = false;

  @Output() emitClear: EventEmitter<void> = new EventEmitter<void>();
  @Output() emitConfirm: EventEmitter<void> = new EventEmitter();
  @Output() emitSetCrawled: EventEmitter<void> = new EventEmitter();
}
