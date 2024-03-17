import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies";

@Injectable({
  providedIn: "root",
})
export class CookiesService {
  setCookie(key: string, value: any, expireHours?: number): void {
    const expireDay = expireHours / 24 || 1;
    Cookie.set(key, value, expireDay, "/");
  }

  getCookie(key: string): any {
    return Cookie.get(key);
  }
}
