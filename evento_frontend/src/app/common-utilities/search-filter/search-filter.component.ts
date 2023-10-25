import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { clearSearchFilter } from '../logic/search-filter-helper';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {
  searchString = ''
  timeout = null;
  delay = 300;
  getScreenWidth;
  isFocused = false;
  constructor(
    private sessionStorageService: SessionStorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      clearTimeout(this.timeout);
      clearSearchFilter(this.sessionStorageService)
    });
  }

  onSearchChange() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.sessionStorageService.setSearchString(this.searchString);
    }, this.delay)
  }
  @HostListener("window:resize")
  getScreenSize() {
    this.getScreenWidth = window.innerWidth;
  }
  @HostListener("document:mousedown", ["$event"])
  public onMouseDownTrigger(event: any) {
    const inputElement: HTMLInputElement = event.srcElement
    if (inputElement.id !== "searchright") {
      const inputBar = document.getElementById("searchright")
      if (inputElement.id === "searchlabel") {
        if (!this.isFocused) {
          inputBar.classList.add("focus")
        }
        else {
          clearSearchFilter(this.sessionStorageService)
          inputBar.classList.remove("focus")
        }
      }
      else {
        console.log(inputElement.value)
        if (this.isFocused && !inputElement.value) {
          inputBar.classList.remove("focus")
        }
      }
      if (this.isFocused || event.srcElement.id === "searchlabel") {
        this.isFocused = !this.isFocused;
      }
    }
  }
}
