import { SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/category.service';
import { Category } from 'src/app/models/category';
import { FileUploadService } from 'src/app/file-upload.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  categoryName = new FormControl('')
  subcategoryName = new FormControl('')
  categories: Category[]
  submitted: boolean
  image: File
  choosen:boolean
  uploaded_file:any

  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService
  ) { }


  ngOnInit(): void {
    this.categoryService.categories.subscribe(cat => this.categories = cat);
  }

  addNewCategory():void {
    const category = new Category();
    category.name = this.categoryName.value;
    category.subcategories = []
    this.categoryService.createCategory(category).subscribe()
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category._id).subscribe()
  }

  addNewSubcategory(category: Category): void {
    category.subcategories.push(this.subcategoryName.value)
    this.categoryService.updateCategory(category._id, category).subscribe()
  }

  deleteSubcategory(category: Category, subcategory: string): void {
    category.subcategories = category.subcategories.filter(cat => cat != subcategory )
    this.categoryService.updateCategory(category._id, category).subscribe()
  }
  fileChoosen(event: any){
    if(event.target.value){
      this.image=<File>event.target.files[0];
      this.choosen=true
    }
  }
  submitPhoto(){
    const formdata: FormData = new FormData();
 
    formdata.append('file', this.image);
    this.submitted = true;
    if(this.image){

      this.fileService.uploadFile(formdata).subscribe((res)=>{
        this.uploaded_file = res        
      })
    }
  }
}
