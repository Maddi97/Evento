import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Category, Subcategory } from "../../models/category";
import { debounceTime, map, mergeMap, take } from "rxjs/operators";
import { CategoriesService } from "../../categories/categories.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileService } from "../../file.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  // List of all Categories
  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];
  @Input() filteredCategory: any;
  @Input() filteredSubcategories: any;
  @Output() categoryOutputEmitter = new EventEmitter<any>();
  @Output() subCategoryOutputEmitter = new EventEmitter<Subcategory[]>();

  public getScreenWidth: any;

  // filteredSubcategories
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;

  // clicked date

  constructor(
    private categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    //document.getElementById('main-category-container').scrollLeft = 0;
    this.setScrollMaxBool();

    const categories$ = this.categoriesService.categories.pipe(
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
    );

    categories$.subscribe(() => {
      this.downloadCategoryIcon();
      this.scrollToClicked();
    });
    // this.applyFilters()
    // request categories
    if (this.categoryList.length < 1) {
      this.categoriesService.getAllCategories();
    }
  }

  // add or remove clicked category to list of filter
  addCategoryToFilter(cat: any) {
    // scroll.scrollLeft = scroll.scrollWidth / 3
    if (this.filteredCategory.name === cat.name) {
      return;
    } else {
      this.filteredCategory = cat;
    }

    // if remove category also remove subcategories
    if (cat.subcategories !== undefined) {
      this.filteredSubcategories = [];
    }
    this.setRouteParameter({
      subcategory: this.filteredSubcategories,
      category: this.filteredCategory._id,
    });
    this.categoryOutputEmitter.emit(this.filteredCategory);
    this.subCategoryOutputEmitter.emit(this.filteredSubcategories);
  }

  addSubcategoryToFilter(subcat: Subcategory) {
    if (!this.filteredSubcategories.includes(subcat)) {
      // because only push doesnt trigger ngOnchanges
      this.filteredSubcategories.push(subcat);
      this.filteredSubcategories = [].concat(this.filteredSubcategories);
    } else {
      // remove subcat from list
      this.filteredSubcategories = this.filteredSubcategories.filter(
        (obj) => obj !== subcat
      );
    }
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map((sub) => sub._id),
      category: this.filteredCategory._id,
    });
    this.subCategoryOutputEmitter.emit(this.filteredSubcategories);
  }

  // change color if category picked
  isCategoryPicked(cat: any) {
    if (this.filteredCategory.name === cat.name) {
      return "category-picked";
    } else {
      return "category-non-picked";
    }
  }

  isSubCategoryPicked(subcat: any) {
    if (this.filteredSubcategories.includes(subcat)) {
      return "subcategory-picked";
    } else {
      return "subcategory-non-picked";
    }
  }

  empty_filters() {
    this.filteredCategory = { name: "hot" };
    this.filteredSubcategories = [];
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
          this.fileService
            .downloadFile(category.iconPath)
            .subscribe((imageData) => {
              // create temporary Url for the downloaded image and bypass security
              const unsafeImg = URL.createObjectURL(imageData);
              category.iconTemporaryURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            });
        }
      }
    });
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
    element.scrollLeft += 160;
    subcatEl.scrollLeft += 160;
    this.setScrollMaxBool();
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById("main-category-container");
    const subcatEl = document.getElementById("subcategory-container");

    element.scrollLeft -= 160;
    subcatEl.scrollLeft -= 160;

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
