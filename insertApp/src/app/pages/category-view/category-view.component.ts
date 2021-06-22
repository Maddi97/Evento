import {Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/category.service';
import {Category, Subcategory} from 'src/app/models/category';
import { FileUploadService } from 'src/app/file-upload.service';
import { map, share } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit{

  categoryName = new FormControl('')
  subcategoryName = new FormControl('')
  categories: Category[]
  image: File
  chosen:boolean
  uploadedFile:any

  clickedSubcategory: number;


  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,

) { }

  ngOnInit(): void {
    this.categoryService.categories.subscribe(cat => {
      this.categories = cat
      console.log(this.categories)
    });
  }

  addNewCategory():void {
    let category = new Category();
    category.name = this.categoryName.value;
    if(this.image) {
      this.categoryService.createCategory(category).pipe(
          map(catRes => {
            category = catRes
            const categoryImagePath = 'category_images/' + catRes._id
            const formdata: FormData = new FormData();
            formdata.append('file', this.image);
            formdata.append('file_path', categoryImagePath)
            this.fileService.uploadFile(formdata).subscribe((response) => {
              category.iconPath = response.path
              this.categoryService.updateCategory(category._id, category).subscribe(x => console.log('cat: ', x))

            })
          }),
      )
    }
      else{
          console.error('No image uploaded, but its necessary for a category!')
        }
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category._id).subscribe()
  }

  addNewSubcategory(category: Category): void {
    let subcategory = new Subcategory()
    subcategory.name = this.subcategoryName.value
    category.subcategories.push(subcategory)

    if(this.image){
      this.categoryService.updateCategory(category._id, category).subscribe(
          catRes => {
            category = catRes
            subcategory = category.subcategories.find(sub =>
              sub.name === subcategory.name
             )
            const subcategoryImagePath = 'category_images/' + catRes._id + '/' + subcategory._id
            const formdata: FormData = new FormData();
            formdata.append('file', this.image);
            formdata.append('file_path', subcategoryImagePath)
            this.fileService.uploadFile(formdata).subscribe((response)=> {
              category.subcategories.map(sub => {
                if(sub._id == subcategory._id){ sub.iconPath = response.path }
              })
              this.categoryService.updateCategory(category._id, category).subscribe(console.log(this.categories) )
            })
          },
      )
    }
    else{
      console.error('No image uploaded, but its necessary for a category!')
    }

  }

  deleteSubcategory(category: Category, subcategory): void {
    category.subcategories = category.subcategories.filter(subcat => subcat.name !== subcategory.name )
    this.categoryService.updateCategory(category._id, category).subscribe()
  }
  fileChosen(event: any){
    if(event.target.value){
      this.image = (event.target.files[0] as File);
      this.chosen = true
    }
  }

  //Problem: dadurch, dass auf Icon Download gewartet werden muss aber mehrfach angefragt wird, werden die Bilder oft gedownloaded, bis der iconTemporaryPath aktualisiert wurde
  downloadImage(categoryId){
    let iconURL;
    this.categories.forEach(cat =>{
      if (cat._id === categoryId){
        if(cat.iconTemporaryURL === undefined){
          this.fileService.downloadFile( cat.iconPath ).subscribe(imageData => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            const tempIconURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            cat.iconTemporaryURL = tempIconURL
        })
      }
        iconURL = cat.iconTemporaryURL
    }}
    )
    return iconURL
  }
  uploadNewSubcategoryIcon(){
  return 0
  }
  clickSubcategory(id){
    console.log(id, this.clickedSubcategory)
    if(id == this.clickedSubcategory) {
      this.clickedSubcategory = 0
    }
    else{
      this.clickedSubcategory=id
    }
  }

}
