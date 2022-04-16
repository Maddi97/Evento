import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'vents-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  INSERT = 'insert'
  DATENSCHUTZ = 'datenschutz'
  IMPRESSUM = 'impressum'


  showInsert = false;
  showDatenschutz = false;
  showImpressum = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  clickPanel(panel: String): void {
    if (panel === this.INSERT) {
      this.showInsert = !this.showInsert
      this.showDatenschutz = false;
      this.showImpressum = false;
    } else if (panel === this.IMPRESSUM) {
      this.showImpressum = !this.showImpressum
      this.showDatenschutz = false;
      this.showInsert = false;
    } else if (panel === this.DATENSCHUTZ) {
      this.showDatenschutz = !this.showDatenschutz
      this.showInsert = false;
      this.showImpressum = false;
    }
  }

}
