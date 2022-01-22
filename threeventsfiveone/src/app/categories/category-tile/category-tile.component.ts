import {Component, OnInit, Input} from '@angular/core';
import {Category} from 'src/app/models/category';
@Component({
  selector: 'vents-category-tile',
  templateUrl: './category-tile.component.html',
  styleUrls: ['./category-tile.component.css']
})
export class CategoryTileComponent implements OnInit {

  @Input() category: Category;

  showSubcategories = false;

  constructor() {

  }

  ngOnInit(): void {
  }

  onClick() {
    this.showSubcategories ? this.showSubcategories = false : this.showSubcategories = true
  }



}
