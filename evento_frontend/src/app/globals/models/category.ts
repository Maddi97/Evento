import { SafeResourceUrl } from '@angular/platform-browser';

export class Category {
  _id: string;
  name: string;
  weight: string;
  iconTemporaryURL: SafeResourceUrl;
  iconPath: string;
  subcategories: Subcategory[];
  stockImageTemporaryURL: SafeResourceUrl;
  stockImagePath: string;
}

export class Subcategory {
  _id: string;
  name: string;
  weight: string;
  iconTemporaryURL: SafeResourceUrl;
  iconPath: string;
  stockImageTemporaryURL: SafeResourceUrl;
  stockImagePath: string;
}
