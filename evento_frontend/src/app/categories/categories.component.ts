import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from './categories.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryList: Category[] = [];
  category$;

  constructor(
    private categoriesService: CategoriesService,
  ) {
  }
  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe(
      {
        next: (categories: Category[]) => {
          this.categoryList = categories;
        },
        error: (error) => {
          // Handle error here
          console.error('An error occurred while fetching categories', error);
        },
        complete: () => { console.log('Complete categories') }
      }
    );
  }

}

