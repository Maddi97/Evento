import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {Category, Subcategory} from '../../models/category';
import {map, mergeMap} from 'rxjs/operators';
import {CategoriesService} from '../../categories/categories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileService} from '../../file.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  // List of all Categories
  categoryList: Category[] = [];

  subcategoryList: Subcategory[] = [];
  filteredCategory: any = 'hot';

  @Output() categoryOutputEmitter = new EventEmitter<any>();
  @Output() subCategoryOutputEmitter = new EventEmitter<Subcategory[]>();

  public getScreenWidth: any;

  // filteredSubcategories
  filteredSubcategories = [];
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;

  // clicked date

  constructor(
    private categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnDestroy() {
    // this.events$.unsubscribe()
    this.empty_filters()
  }


  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    document.getElementById('main-category-container').scrollLeft = 0;

    this.filteredCategory = 'hot'

    const categories$ = this.categoriesService.categories.pipe(
      map((categories: Category[]) => {
        this.categoryList = categories;
        categories.forEach((category: Category) => {
          category.subcategories.forEach(subcategory => {
            this.subcategoryList.push(subcategory);
          })
        })
      })
    )


    const params$ = this._activatedRoute.queryParams.pipe(
      map(params => {
        const category = params.category;
        if (category !== undefined) {
          this.categoryList.forEach(c => {
            if (c._id === category) {
              this.filteredCategory = c;
            }
          });
        }

        const subcategories = params.subcategory;
        if (subcategories !== undefined) {
          this.subcategoryList.forEach(s => {
            if (subcategories.includes(s._id)) {
              this.filteredSubcategories.push(s);
            }
          });
        }
        this.categoryOutputEmitter.emit(this.filteredCategory);
        this.subCategoryOutputEmitter.emit(this.filteredSubcategories);
      }));

    categories$
      .pipe(
        mergeMap(() => params$)
      )
      .subscribe(() => {
        this.downloadCategoryIcon()
      })
    // this.applyFilters()
    // request categories
    if (this.categoryList.length < 1) {
      this.categoriesService.getAllCategories();
    }

  }

  // add or remove clicked category to list of filter
  addCategoryToFilter(cat: any) {
    // scroll.scrollLeft = scroll.scrollWidth / 3

    if (this.filteredCategory === cat) {
      return;
    } else {
      this.filteredCategory = cat;
    }

    // if remove category also remove subcategories
    if (cat.subcategories !== undefined) {
      this.filteredSubcategories = [];
    }
    this.setRouteParameter({subcategory: this.filteredSubcategories, category: this.filteredCategory._id})
    this.categoryOutputEmitter.emit(this.filteredCategory)
    this.subCategoryOutputEmitter.emit(this.filteredSubcategories)
  }

  addSubcategoryToFilter(subcat: Subcategory) {
    if (!this.filteredSubcategories.includes(subcat)) {
      // because only push doesnt trigger ngOnchanges
      this.filteredSubcategories.push(subcat)
      this.filteredSubcategories = [].concat(this.filteredSubcategories)

    } else {
      // remove subcat from list
      this.filteredSubcategories = this.filteredSubcategories.filter(obj => obj !== subcat);
    }
    this.setRouteParameter({
      subcategory: this.filteredSubcategories.map(sub => sub._id),
      category: this.filteredCategory._id
    })
    this.subCategoryOutputEmitter.emit(this.filteredSubcategories)

  }

  // change color if category picked
  isElementPicked(cat: any) {
    if (this.filteredCategory === cat || this.filteredSubcategories.includes(cat)) {
      return 'category-picked';
    } else {
      return 'category-non-picked';
    }
  }


  empty_filters() {
    this.filteredCategory = 'hot'
    this.filteredSubcategories = []
  }

  setRouteParameter(params) {
    this.router.navigate([], {
      queryParams: params,
      relativeTo: this._activatedRoute
    });
  }

  downloadCategoryIcon() {

    this.categoryList.forEach(category => {
      if (category.iconPath !== undefined) {
        if (category.iconTemporaryURL === undefined) {
          this.fileService.downloadFile(category.iconPath).subscribe(imageData => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            category.iconTemporaryURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          });
        }

      }
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event ?) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool()
  }

  scrollRight() {
    const element = document.getElementById('main-category-container')
    element.scrollLeft += 80;
    this.setScrollMaxBool()
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById('main-category-container')
    element.scrollLeft -= 80;
    this.setScrollMaxBool()
  }

  @HostListener('window:mouseover', ['$event'])
  setScrollMaxBool() {
    const element = document.getElementById('main-category-container')
    this.scrollLeftMax = (element.scrollLeft === 0)
    this.scrollRightMax = (element.scrollLeft === element.scrollWidth - element.clientWidth);
  }

}
