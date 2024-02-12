import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Settings } from "@globals/models/settings";
import { Search } from "@globals/types/search.types";
import { EMPTY_SEARCH } from "@globals/constants/search";
type ScrollingDirection = "up" | "down";
type ScrollOutIn = {
  direction: ScrollingDirection;
  distanceTop: number;
  distanceBottom: number;
};

@Injectable({
  providedIn: "root",
})
export class SharedObservableService {
  private settingsSubject = new BehaviorSubject<Settings>(null);
  public settingsObservable: Observable<Settings> =
    this.settingsSubject.asObservable();

  private numberOfScrolls = 0;
  private scrollSubject = new Subject<ScrollingDirection>();
  private scrollOutInSubscject = new Subject<Boolean>();
  public scrollObservable = this.scrollSubject.asObservable();
  public scrollOutInOfScreenObservable =
    this.scrollOutInSubscject.asObservable();

  private searchStringSubject = new BehaviorSubject<Search>(EMPTY_SEARCH);
  public searchStringObservable = this.searchStringSubject.asObservable();

  public setSettings(settings: Settings): void {
    this.settingsSubject.next(settings);
  }
  public notifyScrolling(scrollingDirection: ScrollingDirection): void {
    this.scrollSubject.next(scrollingDirection);
  }

  public notifyScrollOutInOfScreen(scrollOutIn: ScrollOutIn): void {
    if (scrollOutIn.distanceTop < 15 || scrollOutIn.distanceBottom < 1) {
      this.scrollOutInSubscject.next(false);
    } else if (this.numberOfScrolls > 15) {
      this.scrollOutInSubscject.next(scrollOutIn.direction === "down");
      this.numberOfScrolls = 0;
    }
    this.numberOfScrolls++;
  }

  public setSearchString(searchString: Search): void {
    if (
      searchString.searchString !== this.searchStringSubject.value.searchString
    ) {
      this.searchStringSubject.next(searchString);
    }
  }
  public clearSearchFilter() {
    if (
      EMPTY_SEARCH.searchString !== this.searchStringSubject.value.searchString
    ) {
      this.searchStringSubject.next(EMPTY_SEARCH);
    }
  }
}
