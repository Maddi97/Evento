
export class Category {
    _id: string;
    name: string = '';
    weight: string = '0';
    iconTemporaryURL: string;
    iconPath: string;
    stockImageTemporaryURL: string;
    stockImagePath: string;
    subcategories: Subcategory[] = [];
}

export class Subcategory {
    _id: string;
    name: string;
    weight: string;
    iconTemporaryURL: string;
    iconPath: string;
    stockImageTemporaryURL: string;
    stockImagePath: string;
}