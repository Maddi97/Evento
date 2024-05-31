import { Component, OnInit } from "@angular/core";
import { SettingsService } from "@shared/services/settings/settings.service.service";
import { StoreDatasetService } from "@shared/services/store-dataset/store-dataset.service";
import { Settings } from "@globals/models/settings";
import { CommonModule } from "@angular/common";
import { GlobalSettingsFormComponent } from "../../../shared/molecules/global-settings-form/global-settings-form.component";
@Component({
  selector: "app-global-settings",
  standalone: true,
  imports: [CommonModule, GlobalSettingsFormComponent],
  templateUrl: "./global-settings.component.html",
  styleUrls: ["./global-settings.component.css"],
})
export class GlobalSettingsComponent implements OnInit {
  settings: Settings;
  constructor(
    private settingsService: SettingsService,
    private storeDatasetService: StoreDatasetService
  ) {}
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
  testStore() {
    this.storeDatasetService
      .storeEventDetailsDataset([
        {
          name: "pimmel",
          pimmel: "name",
          link: "https://www.urbanite.net/leipzig/events/linc-2024/2024-05-30/",
        },
        {
          name: "pimmel2",
          pimmel: "name2",
          link: "https://www.urbanite.net/leipzig/events/linc-2024/2024-05-30/",
        },
      ])
      .subscribe();
  }
}
