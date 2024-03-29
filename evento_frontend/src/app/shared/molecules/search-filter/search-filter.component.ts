import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { EMPTY_SEARCH } from "@globals/constants/search";
import { Search } from "@globals/types/search.types";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from "rxjs";
@Component({
  selector: "app-search-filter",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.css"],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  search: Search = EMPTY_SEARCH;
  delay = 750;
  getScreenWidth;
  isFocused = false;
  event$: Subscription;
  searchStringForm;
  constructor(
    private sharedObservableService: SharedObservableService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnDestroy(): void {
    this.event$?.unsubscribe();
  }

  ngOnInit() {
    this.getScreenWidth = this.getScreenSize();
    this.searchStringForm = this.formBuilder.group({
      searchString: [""],
    });
    this.sharedObservableService.searchStringObservable
      .pipe(
        filter(
          (search: Search) =>
            search.searchString !== this.searchStringForm.get("searchString")
        ),
        tap((search: Search) =>
          this.searchStringForm
            .get("searchString")
            .setValue(search.searchString)
        )
      )
      .subscribe();
    this.searchStringForm
      .get("searchString")
      .valueChanges.pipe(
        debounceTime(this.delay),
        distinctUntilChanged(),
        map((searchString: string) => {
          this.search = {
            event: searchString.length > 0 ? "Input" : "Reset",
            searchString: searchString,
          };
          return this.search;
        }),
        tap((search: Search) =>
          this.sharedObservableService.setSearchString(search)
        )
      )
      .subscribe();
  }

  @HostListener("window:resize")
  getScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenWidth = window.innerWidth;
    }
  }
  @HostListener("document:scroll")
  hideSearchOnScroll() {
    const inputElement =
      document.getElementById("search-filter-small") ||
      document.getElementById("search-filter-big");
    inputElement.classList.remove("focus");
    inputElement.blur();
    this.isFocused = false;
  }

  @HostListener("window:touch", ["$event"])
  @HostListener("window:mousedown", ["$event"])
  public onMouseDownTrigger(event: any) {
    const inputElement: HTMLInputElement = event.srcElement;
    if (inputElement.id.includes("search-filter")) {
      return;
    }
    const inputBar = document.getElementById("search-filter-small");
    const isSearchFocused = inputBar?.classList?.contains("focus");
    if (inputElement.id.includes("searchlabel")) {
      if (!isSearchFocused) {
        inputBar.classList.add("focus");
      } else {
        inputBar.classList.remove("focus");

        if (this.search.searchString.length > 0) {
          this.sharedObservableService.clearSearchFilter();
        }
        setTimeout(() => {
          if (Capacitor.isNativePlatform()) {
            Keyboard.hide();
          }
        }, 10);
      }
    } else {
      if (isSearchFocused && !inputElement.value) {
        inputBar.classList.remove("focus");
        inputBar.blur();
        setTimeout(() => {
          if (Capacitor.isNativePlatform()) {
            Keyboard.hide();
          }
        }, 10);
      }
    }
  }
}
