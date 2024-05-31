import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WebService {
  readonly ROOT_URL;
  readonly DATASERVER_ROOT_URL;
  env = environment;

  constructor(private http: HttpClient) {
    this.ROOT_URL = this.env.apiBaseUrl;
    this.DATASERVER_ROOT_URL = this.env.dataServerBaseUrl;
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  downloadFile(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {
      responseType: "blob",
    });
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
  postDataset(uri: string, payload) {
    return this.http.post(`${this.DATASERVER_ROOT_URL}/${uri}`, payload);
  }
}
