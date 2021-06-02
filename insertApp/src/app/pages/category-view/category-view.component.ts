import {Component, OnChanges, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/category.service';
import { Category } from 'src/app/models/category';
import { FileUploadService } from 'src/app/file-upload.service';
import { map, share } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {icon} from 'leaflet';



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



  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer
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
    console.log(category)
    if(this.image){
      this.categoryService.createCategory(category).pipe(
        map(catRes => {
            category = catRes
            const categoryImagePath = 'category_images/' + catRes._id
            const formdata: FormData = new FormData();
            formdata.append('file', this.image);
            formdata.append('file_path', categoryImagePath)
            this.fileService.uploadFile(formdata).subscribe((response)=> {
              category.iconPath = response.path
              this.categoryService.updateCategory(category._id, category).subscribe(x => console.log('cat: ', x) )
          })
        }),
        share()
        ).toPromise().then(() => { console.log(this.categories)
    })
      }
      else{
          console.error('No image uploaded, but its necessary for a category!')
        }
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category._id).subscribe()
  }

  addNewSubcategory(category: Category): void {
    category.subcategories.push(this.subcategoryName.value)
    this.categoryService.updateCategory(category._id, category).subscribe()
  }

  deleteSubcategory(category: Category, subcategory: string): void {
    category.subcategories = category.subcategories.filter(cat => cat !== subcategory )
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
}
