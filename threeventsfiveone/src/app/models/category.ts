import {SafeResourceUrl} from '@angular/platform-browser';

export class Category{
  _id: string;
  name: string;
  iconTemporaryURL: SafeResourceUrl;
  iconPath: string;
  subcategories: Subcategory[];
}

export class Subcategory{
  _id: string;
  name: string;
  iconTemporaryURL: SafeResourceUrl;
  iconPath: string;
}
