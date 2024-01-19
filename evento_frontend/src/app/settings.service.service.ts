// settings.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WebService } from "./web.service";
import { Settings } from "./models/settings";

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
