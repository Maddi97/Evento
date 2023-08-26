import { SafeResourceUrl } from '@angular/platform-browser';

export class Category {
    _id: string;
    name: string;
    weight: string;
    iconTemporaryURL: string;
    iconPath: string;
    stockImageTemporaryURL: string;
    stockImagePath: string;
    subcategories: Subcategory[];
}

export class Subcategory {
    _id: string;
    name: string;
    iconTemporaryURL: string;
    iconPath: string;
    stockImageTemporaryURL: string;
    stockImagePath: string;
}