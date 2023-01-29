import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  INSERT = 'insert'
  DATENSCHUTZ = 'datenschutz'
  IMPRESSUM = 'impressum'
  FEEDBACK = 'feedback'


  showInsert = false;
  showDatenschutz = false;
  showImpressum = false;
  showFeedback

  constructor() {
  }

  ngOnInit(): void {
  }

  clickPanel(panel: String): void {
    if (panel === this.INSERT) {
      this.showInsert = !this.showInsert
      this.showDatenschutz = false;
      this.showImpressum = false;
      this.showFeedback = false;
    } else if (panel === this.IMPRESSUM) {
      this.showImpressum = !this.showImpressum
      this.showDatenschutz = false;
      this.showInsert = false;
      this.showFeedback = false;
    } else if (panel === this.DATENSCHUTZ) {
      this.showDatenschutz = !this.showDatenschutz
      this.showInsert = false;
      this.showImpressum = false;
      this.showFeedback = false;
    } else if (panel === this.FEEDBACK) {
      this.showFeedback = !this.showFeedback;
      this.showDatenschutz = false
      this.showInsert = false;
      this.showImpressum = false;
    }
  }

}
