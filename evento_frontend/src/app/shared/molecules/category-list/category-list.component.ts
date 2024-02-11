import {
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { Subscription } from "rxjs";
import { first, map } from "rxjs/operators";
import { CategoriesService } from "@services/simple/categories/categories.service";
import { FileService } from "@services/complex/files/file.service";
import { Category, Subcategory } from "@globals/models/category";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { isPlatformBrowser } from "@angular/common";
import { Search } from "@globals/types/search.types";
import { MapCenterViewService } from "@services/core/map-center-view/map-center-view.service";
import {
  PromotionCategory,
  NowCategory,
} from "@globals/types/categories.types";
import { CustomRouterService } from "@services/core/custom-router/custom-router.service";
import { Settings } from "@globals/models/settings";
@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  @Input() settings: Settings;
  filteredCategory: any;
  filteredSubcategories: Array<Subcategory>;
  // List of all Categories
  categoryList: Category[];
  subscriptions$: Subscription[] = [];
  subcategoryList: Subcategory[] = [];
  scrollOut: Boolean = false;
  timesScrollOut = 0;
  public getScreenWidth: any;
  search: Search = { searchString: "", event: "Reset" };
  // filteredSubcategories
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;
  scrollCategoriesDistance = 250;
  // clicked date
  showPromotion: boolean = false;
  promotionCategory: PromotionCategory = {
    name: "Hot",
    _id: "1",
  };
  nowCategory: NowCategory = {
    name: "Now",
    _id: "2",
  };
  mapView: boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private gtmService: GoogleTagManagerService,
    private sharedObservables: SharedObservableService,
    private mapCenterViewService: MapCenterViewService,
    private customRouterService: CustomRouterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnDestroy(): void {
    this.subscriptions$.forEach((subscription$: Subscription) => {
      if (subscription$) {
        subscription$.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
    const queryParams$ = this.customRouterService
      .getQueryParamsCategoryListComponent(this.settings)
      .subscribe((queryParams) => {
        [this.categoryList, this.filteredCategory, this.filteredSubcategories] =
          queryParams;
        if (isPlatformBrowser(this.platformId)) {
          this.downloadCategoryIcon();
        }
        this.scrollToClicked();
      });
    const mapView$ = this.mapCenterViewService.isMapViewObservable.subscribe(
      (isMapView) => {
        this.mapView = isMapView;
      }
    );

    const searchString$ =
      this.sharedObservables.searchStringObservable.subscribe(
        (search: Search) => {
          this.search = search;
        }
      );

    if (isPlatformBrowser(this.platformId)) {
      this.getScreenWidth = window.innerWidth;
      //document.getElementById('main-category-container').scrollLeft = 0;
      this.setScrollMaxBool();
    }

    this.sharedObservables.scrollOutInOfScreenObservable.subscribe(
      (scrollOut) => {
        this.scrollOut = scrollOut && !this.mapView;
      }
    );
    this.sharedObservables.settingsObservable.subscribe((settings) => {
      this.showPromotion = settings?.isPromotionActivated;
    });

    this.subscriptions$.push(searchString$, mapView$, queryParams$);
    // this.applyFilters()
    // request categories
  }

  selectCategory(category) {
    this.filteredCategory = category;
    this.filteredSubcategories = [];
    const gtmTag = {
      event: "selectedCategory",
      categoryName: this.filteredCategory.name,
    };
    this.gtmService.pushTag(gtmTag);
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map(
        (subcategory) => subcategory._id
      ),
      category: this.filteredCategory._id,
    });
  }

  selectSubcategory(subcategory) {
    if (
      this.filteredSubcategories
        .map((subcat) => subcat._id)
        .includes(subcategory._id)
    ) {
      this.filteredSubcategories = this.filteredSubcategories.filter(
        (subcat) => subcat._id !== subcategory._id
      );
    } else {
      this.filteredSubcategories.push(subcategory);
    }
    const gtmTag = {
      event: "selectedSubcategory",
      categoryName: this.filteredCategory.name,
      subcategoryName: subcategory.name,
    };
    this.gtmService.pushTag(gtmTag);
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map(
        (subcategory) => subcategory._id
      ),
      category: this.filteredCategory._id,
    });
  }
  // change color if category picked
  isCategoryPicked(cat: any) {
    if (this.filteredCategory?.name === cat.name) {
      return "category-picked";
    } else {
      return "category-non-picked";
    }
  }

  isSubCategoryPicked(subcat: Subcategory) {
    if (
      this.filteredSubcategories
        .map((subcat) => subcat._id)
        .includes(subcat._id)
    ) {
      return "subcategory-picked";
    } else {
      return "subcategory-non-picked";
    }
  }

  empty_filters() {
    this.filteredCategory = { name: "" };
    this.filteredSubcategories = [];
  }

  clearSubcategoryFilters() {
    this.filteredSubcategories = [];
    this.setRouteParameter({
      subcategory: [],
      category: this.filteredCategory._id,
    });
  }

  setRouteParameter(params) {
    this.router.navigate([], {
      queryParams: params,
      relativeTo: this._activatedRoute,
      queryParamsHandling: "merge",
    });
  }

  // sort highest weight to the front
  sortCategoriesByWeight(categoryList) {
    return categoryList.sort((a, b) => {
      const weightA = a.weight ? parseFloat(a.weight) : 0;
      const weightB = b.weight ? parseFloat(b.weight) : 0;
      return weightB - weightA;
    });
  }

  downloadCategoryIcon() {
    this.categoryList.forEach((category) => {
      if (category.iconPath !== undefined) {
        if (category.iconTemporaryURL === undefined) {
          const fileDownload$ = this.fileService
            .downloadFile(category.iconPath)
            .subscribe({
              next: (imageData) => {
                category.iconTemporaryURL = URL.createObjectURL(imageData);
              },
              error: (error) => {
                //console.log(error);
                fileDownload$?.unsubscribe();
              },
              complete: () => {
                //console.log("Image download complete");
                fileDownload$?.unsubscribe();
              },
            });
        }
      }
    });
  }
  clearSearchFilterOnReset() {
    this.sharedObservables.clearSearchFilter();
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool();
  }
  scrollToClicked() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const element: HTMLElement = document.getElementById("category-picked");
        if (!element) return;
        element.scrollIntoView({
          block: "end",
          inline: "center",
          behavior: "instant",
        });
      }, 800);
    }
  }

  scrollRight() {
    const element = document.getElementById("main-category-container");
    const subcatEl = document.getElementById("subcategory-container");

    if (element) element.scrollLeft += this.scrollCategoriesDistance;
    if (subcatEl) subcatEl.scrollLeft += this.scrollCategoriesDistance;

    this.setScrollMaxBool();
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById("main-category-container");
    const subcatEl = document.getElementById("subcategory-container");
    if (element) element.scrollLeft -= this.scrollCategoriesDistance;
    if (subcatEl) subcatEl.scrollLeft -= this.scrollCategoriesDistance;

    this.setScrollMaxBool();
  }

  @HostListener("window:mouseover", ["$event"])
  setScrollMaxBool() {
    setTimeout(() => {
      const element = document.getElementById("main-category-container");
      if (!element) {
        return;
      }
      this.scrollLeftMax = element.scrollLeft === 0;
      this.scrollRightMax =
        element.scrollLeft === element.scrollWidth - element.clientWidth;
    }, 300);
  }
}
