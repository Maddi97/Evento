import {SafeResourceUrl} from '@angular/platform-browser';

export class Category{
    _id: string;
    name: string;
    iconTemporaryURL: SafeResourceUrl;
    iconPath: string;
    subcategories: string[];
}
