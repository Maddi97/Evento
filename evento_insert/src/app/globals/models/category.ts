export class Category {
  _id: string;
  name: string = "";
  alias: string[];
  weight: string = "0";
  iconTemporaryURL: string;
  iconPath: string;
  stockImageTemporaryURL: string;
  stockImagePath: string;
  subcategories: Subcategory[] = [];
  iconFd?: FormData;
  stockPhotoFd?: FormData;
}

export class Subcategory {
  _id: string;
  name: string;
  alias: string[];
  weight: string = "0";
  iconTemporaryURL: string;
  iconPath: string;
  stockImageTemporaryURL: string;
  stockImagePath: string;
  iconFd?: FormData;
  stockPhotoFd?: FormData;
}
