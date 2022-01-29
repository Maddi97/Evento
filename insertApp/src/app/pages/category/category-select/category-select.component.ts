import {Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CategoryService} from 'src/app/services/category.service';
import {FormControl} from '@angular/forms';
import {Category} from 'src/app/models/category';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

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

        this.selectedSubcategories.setValue(changes.loadedCategory.currentValue?.subcategories)
    }

    private _filter(value: Category): string[] {
        const filterValue = value.name.toLowerCase();
        return this.categories.map(cat => cat.name).filter(cat => cat.toLowerCase().includes(filterValue));
    }

    selectCategory() {
        this.selectedCategory = this.categories.find(cat => cat.name === this.categoryName.value)
        const cat = {
            _id: this.selectedCategory._id,
            name: this.selectedCategory.name,
            iconPath: this.selectedCategory.iconPath,
            iconTemporaryURL: this.selectedCategory.iconTemporaryURL,
            subcategories: [],
        }
        this.newCategorySelect.emit(cat)
    }

    emitCategory() {
        const cat = {
            _id: this.selectedCategory._id,
            name: this.selectedCategory.name,
            iconPath: this.selectedCategory.iconPath,
            iconTemporaryURL: this.selectedCategory.iconTemporaryURL,
            subcategories: this.selectedSubcategories.value
        }
        this.newCategorySelect.emit(cat)
    }

}
