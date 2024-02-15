import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { TransferStateService } from "@services/core/transfer-state/transfer-state.service";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class WebService {
  readonly ROOT_URL;

  env = environment;

  constructor(
    private http: HttpClient,
    private transferStateService: TransferStateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Use Docker network address for server-side requests
      this.ROOT_URL = this.env.apiBaseUrlServer;
    } else {
      // Use localhost for client-side requests
      this.ROOT_URL = this.env.apiBaseUrlBrowser;
    }
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  post(uri: string, payload: object) {
    const stateKey = this.transferStateService.getDynamicStateKey(
      JSON.stringify({ uri, payload: Object.values(payload) })
    );
    const httpObservable = this.http.post(`${this.ROOT_URL}/${uri}`, payload);
    return this.transferStateService.transferState(stateKey, httpObservable);
  }

  put(uri: string, payload: object) {
    return this.http.put(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  downloadFile(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {
      responseType: "blob",
    });
  }
}
