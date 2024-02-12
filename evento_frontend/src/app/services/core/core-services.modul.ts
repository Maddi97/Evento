import { NgModule } from "@angular/core";
import { SharedObservableService } from "./shared-observables/shared-observables.service";
import { SessionStorageService } from "./session-storage/session-storage.service";

@NgModule({
  declarations: [SessionStorageService],
  exports: [],
  imports: [],
  providers: [SharedObservableService],
})
export class CoreServicesModul {}
