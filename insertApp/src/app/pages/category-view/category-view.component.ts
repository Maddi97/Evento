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


  categoryName = new FormControl('')
  subcategoryName = new FormControl('')
  categories: Category[]
  category$;
  image: File
  chosen:boolean
  uploadedFile:any
  clickedSubcategory: number;
  update = false;
  updateSub = false;
  updateCategoryObject;
  updateSubcategoryObject;

  private _allowed_image_types = ["image/png", "image/jpeg", "image/jpg"]
  private _max_image_size = 50000
  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,
    private _snackbar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.category$ = this.categoryService.categories
        .pipe(
            map(
                cat => {
                  this.downloadImage(cat)
                  this.categories = cat
    }));
    this.category$.subscribe()
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

  downloadImage(categories){
    categories.forEach( cat => {
      let IconUrl = null
      if (cat.iconPath != undefined) {
        if (cat.iconTemporaryURL === undefined) {
          this.fileService.downloadFile(cat.iconPath).subscribe(imageData => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            IconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            cat.iconTemporaryURL = IconUrl
          })
        }
      }
      if(cat.subcategories.length > 0){
        cat.subcategories.forEach(sub =>{
          if(sub.iconPath != undefined){
            if (sub.iconTemporaryURL === undefined){
              this.fileService.downloadFile(sub.iconPath).subscribe(imageData => {
                // create temporary Url for the downloaded image and bypass security
                const unsafeImg = URL.createObjectURL(imageData);
                IconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                sub.iconTemporaryURL = IconUrl;
              })
            }
          }
        })
      }
    })
  }

  clickSubcategory(id){
    if(id == this.clickedSubcategory) {
      this.clickedSubcategory = 0
    }
    else{
      this.clickedSubcategory=id
    }
  }

  updateCategory(){
    let category = this.updateCategoryObject
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
        const categoryImagePath = 'category_images/' + category._id
        const formdata: FormData = new FormData();
        formdata.append('file', this.image);
        formdata.append('file_path', categoryImagePath)
      //TODO delete old Icon
            this.fileService.uploadFile(formdata).subscribe((response) => {
              category.iconPath = response.path
              this.categoryService.updateCategory(category._id, category).subscribe(
                  category => this.openSnackBar("Successfully uploaded category: "+ category.name, 'success'),
                  err => this.openSnackBar("An error occured: "+ err, 'error'),
              )
            })

        this.resetForms()

    }
    else{
      this.categoryService.updateCategory(category._id, category).subscribe(
          category => this.openSnackBar("Successfully uploaded category: "+ category.name, 'success'),
          err => this.openSnackBar("An error occured: "+ err, 'error'),
      )
      this.resetForms()
    }
  }

  updateSubcategory(category){


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
      let subcategory = this.updateSubcategoryObject
      subcategory.name = this.subcategoryName.value

      this.categoryService.updateCategory(category._id, category).subscribe(
          catRes => {
            category = catRes

            const subcategoryImagePath = 'category_images/' + catRes._id + '/' + subcategory._id
            const formdata: FormData = new FormData();
            formdata.append('file', this.image);
            formdata.append('file_path', subcategoryImagePath)
            this.fileService.uploadFile(formdata).subscribe(response => {
              category.subcategories.map(sub => {
                if(sub._id == subcategory._id){ sub.iconPath = response.path }
              })
              console.log('mon', category)
              this.categoryService.updateCategory(category._id, category).subscribe(
                  category => this.openSnackBar("Successfully uploaded subcategory: "+ subcategory.name, 'success'),
                  err => this.openSnackBar("An error occured: "+ err, 'error'),
                  () => this.resetForms())
            })
          },
      )
    }
    else{
      let subcategory = this.updateSubcategoryObject
      subcategory.name = this.subcategoryName.value

      this.categoryService.updateCategory(category._id, category).subscribe(
          category => this.openSnackBar("Successfully updated subcategory: "+ subcategory.name, 'success'),
          err => this.openSnackBar("An error occured: "+ err, 'error'),
          () => this.resetForms())
    }
  }

  editCategoryClicked(category){
    let value = this.categoryName.value != category.name ? category.name : '';
    this.update = !this.update;
    this.updateCategoryObject = category
    this.categoryName.setValue(value)
  }
  editSubcategoryClicked(category, sub){

    let value = this.subcategoryName.value != sub.name ? sub.name : '';
    this.updateSub = !this.updateSub;
    this.updateSubcategoryObject = sub
    this.subcategoryName.setValue(value)
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
    this.updateCategoryObject = null;
    this.update= false;
    this.updateSubcategoryObject = null;
    this.updateSub = false;
  }

}
