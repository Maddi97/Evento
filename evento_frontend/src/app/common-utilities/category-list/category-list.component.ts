import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleTagManagerService } from "angular-google-tag-manager";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { CategoriesService } from "../../categories/categories.service";
import { FileService } from "../../file.service";
import { Category, Subcategory } from "../../models/category";
import { clearSearchFilter } from "../logic/search-filter-helper";
import { SessionStorageService } from "../session-storage/session-storage.service";
type ID = string;

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  @Input() filteredCategory: any;
  @Input() filteredSubcategories: Array<Subcategory>;

  // List of all Categories
  categoryList: Category[] = [];
  subscriptions$: Subscription[] = [];
  subcategoryList: Subcategory[] = [];

  public getScreenWidth: any;
  searchString: string = '';
  // filteredSubcategories
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;

  // clicked date

  constructor(
    private categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private gtmService: GoogleTagManagerService
  ) { }
  ngOnDestroy(): void {
    this.subscriptions$.forEach((subscription$: Subscription) => {
      if (subscription$) {
        subscription$.unsubscribe()
      }
    })
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    //document.getElementById('main-category-container').scrollLeft = 0;
    this.setScrollMaxBool();

    const categories$ = this.categoriesService.getAllCategories().pipe(
      map((categories: Category[]) => {
        this.categoryList = categories;
        this.sortCategoriesByWeight(this.categoryList)
        categories.forEach((category: Category) => {
          this.sortCategoriesByWeight(category.subcategories)
          category.subcategories.forEach((subcategory) => {
            this.subcategoryList.push(subcategory);
          });
        });
      })
    ).subscribe(() => {
      this.downloadCategoryIcon();
      this.scrollToClicked();
    });

    const searchString$ = this.sessionStorageService.searchStringSubject.subscribe(
      (searchString: string) => { this.searchString = searchString })


    this.subscriptions$.push(categories$, searchString$)
    // this.applyFilters()
    // request categories
    if (this.categoryList.length < 1) {
      this.categoriesService.getAllCategories();
    }
  }

  selectCategory(category) {
    this.filteredCategory = category;
    this.filteredSubcategories = []
    const gtmTag = {
                    event: 'selectedCategory',
                    categoryName: this.filteredCategory.name,
                  };
    this.gtmService.pushTag(gtmTag);
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map((subcategory) => subcategory._id),
      category: this.filteredCategory._id,
    });
  }

  selectSubcategory(subcategory) {
    if (this.filteredSubcategories.map(subcat => subcat._id).includes(subcategory._id)) {
      this.filteredSubcategories = this.filteredSubcategories.filter(subcat => subcat._id !== subcategory._id)
    }
    else {
      this.filteredSubcategories.push(subcategory)
    }
    const gtmTag = {
                event: 'selectedSubcategory',
                categoryName: this.filteredCategory.name,
                subcategoryName: subcategory.name,
              };
    this.gtmService.pushTag(gtmTag);
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map((subcategory) => subcategory._id),
      category: this.filteredCategory._id,
    });
  }
  // change color if category picked
  isCategoryPicked(cat: any) {
    if (this.filteredCategory.name === cat.name) {
      return "category-picked";
    } else {
      return "category-non-picked";
    }
  }

  isSubCategoryPicked(subcat: Subcategory) {
    if (this.filteredSubcategories.map((subcat) => subcat._id).includes(subcat._id)) {
      return "subcategory-picked";
    } else {
      return "subcategory-non-picked";
    }
  }

  empty_filters() {
    this.filteredCategory = { name: "hot" };
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
    categoryList.sort((a, b) => {
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
            .subscribe((imageData) => {
              // create temporary Url for the downloaded image and bypass security
              const unsafeImg = URL.createObjectURL(imageData);
              category.iconTemporaryURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            });
          this.subscriptions$.push(fileDownload$)
        }
      }
    });
  }
  clearSearchFilterOnReset() {
    clearSearchFilter(this.sessionStorageService)
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool();
  }
  scrollToClicked() {
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

  scrollRight() {
    const element = document.getElementById("main-category-container");
    const subcatEl = document.getElementById("subcategory-container");

    if(element) element.scrollLeft += 160;
    if(subcatEl) subcatEl.scrollLeft += 160;
    
    this.setScrollMaxBool();
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById("main-category-container");
    const subcatEl = document.getElementById("subcategory-container");

    if(element) element.scrollLeft -= 160;
    if(subcatEl) subcatEl.scrollLeft -= 160;

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
