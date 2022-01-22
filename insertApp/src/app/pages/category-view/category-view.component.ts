import {Component, ElementRef, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/category.service';
import {Category, Subcategory} from 'src/app/models/category';
import { FileUploadService } from 'src/app/file-upload.service';
import { map, share } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar'
import { ViewChild } from '@angular/core';
import * as log from "loglevel";




@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit{

  @ViewChild('imageUpload') inputCat: ElementRef;
  @ViewChild('imageUploadSubcat') inputSubcat: ElementRef;
  @ViewChild('imageUploadUpdateSubcategory') inputUpdateSubcat: ElementRef;

  imageUploadUpdateSubcategory

  categoryName = new FormControl('')
  subcategoryName = new FormControl('')
  categories: Category[]
  image: File
  chosen:boolean
  uploadedFile:any
  clickedSubcategory: number;
  private _allowed_image_types = ["image/png", "image/jpeg", "image/jpg"]
  private _max_image_size = 10000
  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,
    private _snackbar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.categoryService.categories.subscribe(cat => {
      this.categories = cat
    });
  }

  addNewCategory():void {
    let category = new Category();
    category.name = this.categoryName.value;
    if(this.image && this.image.size > this._max_image_size){
      this.openSnackBar('File size too big!', 'error')
      this.resetForms()
      return
    }
    if(this.image && !this._allowed_image_types.includes(this.image.type)){
      this.openSnackBar('File type ' + this.image.type + ' is not allowed', 'error')
      this.resetForms()
      return
    }
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
              this.categoryService.updateCategory(category._id, category).subscribe(
                  category => this.openSnackBar("Successfully uploaded category: "+ category.name, 'success'),
                  err => this.openSnackBar("An error occured: "+ err, 'error'),
              )
          })
        }),
        share()
        ).toPromise().then(() => {
        this.resetForms()
      })
      }
      else{
        this.openSnackBar('No image uploaded, but its necessary for a category!', 'error')
        this.resetForms()
    }
  }

  deleteCategory(category: Category): void {
    if(confirm("Are you sure to delete Category "+ category.name +
        "\nYou are not able to find the related events again")) {
      this.categoryService.deleteCategory(category._id).subscribe()
    }
  }

  addNewSubcategory(category: Category): void {
    if(this.image && this.image.size > this._max_image_size){
      this.openSnackBar('File size too big!', 'error')
      this.resetForms()
      return
    }
    if(this.image && !this._allowed_image_types.includes(this.image.type)) {
      this.openSnackBar('File type ' + this.image.type + ' is not allowed', 'error')
      this.resetForms()
      return
    }
    if(this.image){
      let subcategory = new Subcategory()
      subcategory.name = this.subcategoryName.value
      category.subcategories.push(subcategory)
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
              this.categoryService.updateCategory(category._id, category).subscribe(
                  category => this.openSnackBar("Successfully uploaded subcategory: "+ subcategory.name, 'success'),
                  err => this.openSnackBar("An error occured: "+ err, 'error'),
                  () => this.resetForms())
            })
          },
      )
    }
    else{
      this.openSnackBar("No image icon, but its necessary for a subcategory!", 'error')
    }

  }

  deleteSubcategory(category: Category, subcategory): void {
    if(confirm("Are you sure to delete Subcategory "+ subcategory.name +
        "\nYou are not able to find the related events again")) {
      category.subcategories = category.subcategories.filter(subcat => subcat.name !== subcategory.name)
      this.categoryService.updateCategory(category._id, category).subscribe()
    }
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

  clickSubcategory(id){
    if(id == this.clickedSubcategory) {
      this.clickedSubcategory = 0
    }
    else{
      this.clickedSubcategory=id
    }
  }

  updateSubcategoryIcon(){
    log.debug("to implement")
    this.resetForms()
  }

  openSnackBar(message, state){

    this._snackbar.open(message, '' , {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

    });
  }
  resetForms(){
    this.categoryName.reset();
    this.subcategoryName.reset();
    this.image = null;
    this.inputCat.nativeElement.value = '';
    this.inputSubcat.nativeElement.value = '';
    this.inputUpdateSubcat.nativeElement.value = '';
  }

}
