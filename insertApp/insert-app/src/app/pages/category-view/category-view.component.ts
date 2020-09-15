import { SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { CategoryService } from 'src/app/category.service';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  categoryName = new FormControl();
  selectedSubcategories = new FormControl();
  categories: Category[] = [];

  selectedCategory: Category;

  filteredOptions: Observable<Category[]>;

  constructor(    
    private categoryService: CategoryService,
    ) {
      this.categoryService.categories.subscribe(cat => this.categories = cat)
     }

  ngOnInit(): void {
    this.filteredOptions = this.categoryName.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.categories.slice())
    );
  }
  ngOnChanges(changes: SimpleChanges){
    this.selectedCategory = this.categories.find(cat => cat.name === this.categoryName.value)

    this.selectedSubcategories.setValue(changes.loadedCategory.currentValue?.subcategories)
  }
  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();
    return this.categories.filter(cat => cat.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(cat: Category): string {
    return cat && cat.name ? cat.name : '';
  }

  setCategory(){
    this.selectedSubcategories.setValue(this.categories.find(cat => cat.name === this.categoryName.value).subcategories)
    console.log(this.categoryName.value)
    console.log(this.selectedSubcategories.value)
  }
}
