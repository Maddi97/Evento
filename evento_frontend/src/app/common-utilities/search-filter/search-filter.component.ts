import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { Subscription, filter } from "rxjs";
import { clearSearchFilter } from "../logic/search-filter-helper";
import { SessionStorageService } from "../session-storage/session-storage.service";

@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.css"],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  searchString = "";
  timeout = null;
  delay = 300;
  getScreenWidth;
  isFocused = false;
  event$: Subscription;
  constructor(
    private sessionStorageService: SessionStorageService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this.event$.unsubscribe();
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.event$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        clearTimeout(this.timeout);
        clearSearchFilter(this.sessionStorageService);
      });
  }

  onSearchChange() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.sessionStorageService.setSearchString(this.searchString);
    }, this.delay);
  }
  @HostListener("window:resize")
  getScreenSize() {
    this.getScreenWidth = window.innerWidth;
  }
  @HostListener("document:scroll")
  hideSearchOnScroll() {
    const inputElement = document.getElementById("searchright");
    inputElement.classList.remove("focus");
    inputElement.blur();
    this.isFocused = false;
  }

  @HostListener("document:touch", ["$event"])
  @HostListener("document:mousedown", ["$event"])
  public onMouseDownTrigger(event: any) {
    const inputElement: HTMLInputElement = event.srcElement;
    if (inputElement.id !== "searchright") {
      const inputBar = document.getElementById("searchright");
      if (inputElement.id === "searchlabel") {
        if (!this.isFocused) {
          inputBar.classList.add("focus");
        } else {
          if (this.searchString.length > 0) {
            clearSearchFilter(this.sessionStorageService);
          }
          inputBar.classList.remove("focus");
          setTimeout(() => {
            if (Capacitor.isNativePlatform()) {
              Keyboard.hide();
            }
          }, 10);
        }
      } else {
        if (this.isFocused && !inputElement.value) {
          inputBar.classList.remove("focus");
          inputBar.blur();
          setTimeout(() => {
            if (Capacitor.isNativePlatform()) {
              Keyboard.hide();
            }
          }, 10);
        }
      }
      if (this.isFocused || event.srcElement.id === "searchlabel") {
        this.isFocused = !this.isFocused;
      }
    }
  }
}
