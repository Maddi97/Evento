import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'vents-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryList: Category[] = [];
  constructor(
    private categoriesService: CategoriesService,

  ) { }

  ngOnInit(): void {
    this.categoriesService.categories.subscribe(cat => {
      this.categoryList = cat;
      if (cat.length === 0) {
        this.categoriesService.getAllCategories();
      }
    });
  }

}
