import {Component, OnInit, OnDestroy} from '@angular/core';
import {Category} from '../models/category';
import {CategoriesService} from './categories.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categoryList: Category[] = [];
  category$;

  constructor(
    private categoriesService: CategoriesService,
  ) {
  }

  ngOnInit(): void {
    this.category$ = this.categoriesService.categories
      .pipe(
        map(cat => {
          this.categoryList = cat;
          if (cat.length === 0) {
            this.categoriesService.getAllCategories();
          }
        }));
    this.category$.subscribe();
  }

  ngOnDestroy(): void {
    this.category$.unsubscribe();
  }

}
