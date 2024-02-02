// settings.service.ts

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WebService } from "../../core/web/web.service";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private readonly settingsUrl = "settings"; // Adjust the URL according to your backend API

  constructor(private webService: WebService) {}

  getSettings(): Observable<any> {
    return this.webService.get(this.settingsUrl);
  }
}
