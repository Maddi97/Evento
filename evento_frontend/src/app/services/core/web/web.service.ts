import {
  Inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { isPlatformServer } from "@angular/common";
import { get } from "http";

@Injectable({
  providedIn: "root",
})
export class WebService {
  readonly ROOT_URL;

  env = environment;

  constructor(
    private http: HttpClient,
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
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
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

  get_file(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {
      responseType: "blob",
    });
  }
}
