import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'app-category-select',
    templateUrl: './category-select.component.html',
    styleUrls: ['./category-select.component.css']
})
export class CategorySelectComponent implements OnInit, OnChanges {

    @Input() loadedCategory: Category = new Category()

    @Output() newCategorySelect = new EventEmitter<Category>();


    categoryName = new FormControl(this.loadedCategory.name);
    categories: Category[] = [];
    selectedCategory: Category;
    selectedSubcategories = new FormControl(this.loadedCategory.subcategories);
    filteredOptions: Observable<string[]>;

    constructor(
        private categoryService: CategoryService,
    ) {
    }

    ngOnInit(): void {
        this.categoryService.categories.subscribe(cat => this.categories = cat);
        this.filteredOptions = this.categoryName.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

    }

    ngOnChanges(changes: SimpleChanges) {
        this.categoryName.setValue(changes.loadedCategory.currentValue?.name)
        this.selectedCategory = this.categories.find(cat => cat.name === this.categoryName.value)
        this.selectedSubcategories.setValue(this.loadedCategory?.subcategories)
    }

    private _filter(value): string[] {
        const filterValue = value.name.toLowerCase();
        return this.categories.map(cat => cat.name).filter(cat => cat.toLowerCase().includes(filterValue));
    }

    compareWith(subcat1: any, subcat2: any): boolean {
        return subcat1 && subcat2 && subcat1._id === subcat2._id;
    }

    selectCategory() {
        this.selectedCategory = this.categories.find(categoryResponse => categoryResponse.name === this.categoryName.value)
        const cat = {
            _id: this.selectedCategory._id,
            name: this.selectedCategory.name,
            weight: this.selectedCategory.weight,
            iconPath: this.selectedCategory.iconPath,
            iconTemporaryURL: this.selectedCategory.iconTemporaryURL,
            stockImagePath: this.selectedCategory.stockImagePath,
            stockImageTemporaryURL: this.selectedCategory.stockImageTemporaryURL,
            subcategories: [],
        }

        this.newCategorySelect.emit(cat)
    }

    emitCategory() {
        console.log(this.selectedSubcategories)
        const cat = {
            _id: this.selectedCategory._id,
            name: this.selectedCategory.name,
            weight: this.selectedCategory.weight,
            iconPath: this.selectedCategory.iconPath,
            iconTemporaryURL: this.selectedCategory.iconTemporaryURL,
            stockImagePath: this.selectedCategory.stockImagePath,
            stockImageTemporaryURL: this.selectedCategory.stockImageTemporaryURL,
            subcategories: this.selectedSubcategories.value
        }
        this.newCategorySelect.emit(cat)
    }

}
