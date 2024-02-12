import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DatenschutzComponent } from "@shared/molecules/datenschutz/datenschutz.component";
import { FeedbackComponent } from "@shared/molecules/feedback/feedback.component";
import { InsertEventComponent } from "@shared/molecules/insert-event/insert-event.component";
import { ImpressumComponent } from "@shared/molecules/impressum/impressum.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    InsertEventComponent,
    FeedbackComponent,
    DatenschutzComponent,
    ImpressumComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  INSERT = "insert";
  DATENSCHUTZ = "datenschutz";
  IMPRESSUM = "impressum";
  FEEDBACK = "feedback";

  showInsert = false;
  showDatenschutz = false;
  showImpressum = false;
  showFeedback = false;

  constructor() {}

  ngOnInit(): void {}

  clickPanel(panel: String): void {
    if (panel === this.INSERT) {
      this.showInsert = !this.showInsert;
      this.showDatenschutz = false;
      this.showImpressum = false;
      this.showFeedback = false;
    } else if (panel === this.IMPRESSUM) {
      this.showImpressum = !this.showImpressum;
      this.showDatenschutz = false;
      this.showInsert = false;
      this.showFeedback = false;
    } else if (panel === this.DATENSCHUTZ) {
      this.showDatenschutz = !this.showDatenschutz;
      this.showInsert = false;
      this.showImpressum = false;
      this.showFeedback = false;
    } else if (panel === this.FEEDBACK) {
      this.showFeedback = !this.showFeedback;
      this.showDatenschutz = false;
      this.showInsert = false;
      this.showImpressum = false;
    }
  }
}
