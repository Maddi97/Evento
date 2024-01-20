import { Component, OnInit } from "@angular/core";
import { SettingsService } from "../../../services/settings.service.service";
import { Settings } from "src/app/models/settings";
@Component({
  selector: "app-global-settings",
  templateUrl: "./global-settings.component.html",
  styleUrls: ["./global-settings.component.css"],
})
export class GlobalSettingsComponent implements OnInit {
  settings: Settings;
  constructor(private settingsService: SettingsService) {}
  ngOnInit(): void {
    this.settingsService.getSettings().subscribe((settings) => {
      this.settings = settings;
    });
  }

  applySettings(settings: Settings) {
    if (this.settings) {
      this.settingsService.updateSettings(settings).subscribe((settings) => {
        this.settings = settings;
      });
    } else {
      this.settingsService.addSettings(settings).subscribe((settings) => {
        this.settings = settings;
      });
    }
  }
}
