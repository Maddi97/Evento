import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly ROOT_URL;
  env = environment
  constructor(private http: HttpClient) {

    this.ROOT_URL = this.env.apiBaseUrl;
   }

   get(uri: string) {
     return this.http.get(`${this.ROOT_URL}/${uri}`)
   }

   post(uri: string, payload: Object) {
    console.log(payload)
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload)
  }

  put(uri: string, payload: Object) {
    return this.http.put(`${this.ROOT_URL}/${uri}`, payload)
  }

  patch(uri: string, payload: Object) {
    console.log(payload)
    console.log(uri)
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload)
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`)
  }
}
