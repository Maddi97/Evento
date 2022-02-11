import {Component, ElementRef, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CategoryService} from 'src/app/services/category.service';
import {Category, Subcategory} from 'src/app/models/category';
import {FileUploadService} from 'src/app/services/file-upload.service';
import {map, share} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar'
import {ViewChild} from '@angular/core';
import * as log from 'loglevel';


@Component({
    selector: 'app-category-view',
    templateUrl: './category-view.component.html',
    styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

    @ViewChild('iconUpload') inputCat: ElementRef;
    @ViewChild('stockFotoUpload') inputCat2: ElementRef;

    @ViewChild('iconUploadSubcat') inputSubcat: ElementRef;
    @ViewChild('stockFotoUploadSubcat') inputUpdateSubcat: ElementRef;

    stockImagePath = 'images/category_stockImages/'
    iconPath = 'images/category_icons/'

    categoryName = new FormControl('')
    subcategoryName = new FormControl('')
    categories: Category[]
    category$;
    icon: File;
    stockImage: File;
    chosen: boolean;
    uploadedIcon: any;
    uploadedStockImage: any;
    clickedSubcategory: number;
    update = false;
    updateSub = false;
    updateCategoryObject;
    updateSubcategoryObject;

    private allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg']
    private uploadedIconSize = 50000
    private uploadedStockImageSize = 50000000; // 500MB?

    constructor(
        private categoryService: CategoryService,
        private fileService: FileUploadService,
        private sanitizer: DomSanitizer,
        private _snackbar: MatSnackBar,
    ) {
    }


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

    addNewCategory(): void {
        let category = new Category();
        category.name = this.categoryName.value;

        if (this.icon && this.icon.size > this.uploadedIconSize) {
            this.openSnackBar('File size too big!', 'error')
            this.resetForms()
            return
        }
        if (this.icon && !this.allowedImageTypes.includes(this.icon.type)) {
            this.openSnackBar('File type ' + this.icon.type + ' is not allowed', 'error')
            this.resetForms()
            return
        }
        if (this.icon && this.stockImage) {
            this.categoryService.createCategory(category).pipe(
                map(catRes => {
                    category = catRes
                    const categoryImagePath = this.iconPath + catRes._id
                    const formdata: FormData = new FormData();
                    formdata.append('files', this.icon);
                    formdata.append('file_path', categoryImagePath)

                    const categoryStockImagePath = this.stockImagePath + catRes._id
                    formdata.append('files', this.stockImage);
                    formdata.append('stockImagePath', categoryStockImagePath)
                    this.fileService.uploadCategoryFiles(formdata).subscribe((response) => {
                        category.iconPath = response.icon.path
                        category.stockImagePath = response.stockImage.path
                        this.categoryService.updateCategory(category._id, category).subscribe(
                            categoryResponse => this.openSnackBar('Successfully uploaded category: '
                                + categoryResponse.name, 'success'),
                            err => this.openSnackBar('An error occured: ' + err, 'error'),
                        )
                    })
                }),
                share()
            ).toPromise().then(() => {
                this.resetForms()
            })
        } else {
            this.openSnackBar('No image uploaded, but its necessary for a category!', 'error')
            this.resetForms()
        }
    }

    deleteCategory(category: Category): void {
        if (confirm('Are you sure to delete Category ' + category.name +
            '\nYou are not able to find the related events again')) {
            this.categoryService.deleteCategory(category._id).subscribe()
        }
    }

    addNewSubcategory(category: Category): void {
        if (this.icon && this.icon.size > this.uploadedIconSize) {
            this.openSnackBar('File size too big!', 'error')
            this.resetForms()
            return
        }
        if (this.icon && !this.allowedImageTypes.includes(this.icon.type)) {
            this.openSnackBar('File type ' + this.icon.type + ' is not allowed', 'error')
            this.resetForms()
            return
        }
        if (this.icon && this.stockImage) {
            let subcategory = new Subcategory()
            subcategory.name = this.subcategoryName.value
            category.subcategories.push(subcategory)
            this.categoryService.updateCategory(category._id, category).subscribe(
                catRes => {
                    category = catRes
                    subcategory = category.subcategories.find(sub =>
                        sub.name === subcategory.name
                    )
                    const subcategoryImagePath = this.iconPath + catRes._id + '/' + subcategory._id
                    const formdata: FormData = new FormData();
                    formdata.append('files', this.icon);
                    formdata.append('file_path', subcategoryImagePath)
                    const subcategoryStockImagePath = this.stockImagePath + catRes._id
                    formdata.append('files', this.stockImage);
                    formdata.append('stockImagePath', subcategoryStockImagePath)
                    this.fileService.uploadCategoryFiles(formdata).subscribe((response) => {
                        category.subcategories.map(sub => {
                            if (sub._id === subcategory._id) {
                                sub.iconPath = response.icon.path
                                sub.stockImagePath = response.stockImage.path
                            }
                        })
                        this.categoryService.updateCategory(category._id, category).subscribe(
                            () => this.openSnackBar('Successfully uploaded subcategory: ' + subcategory.name, 'success'),
                            err => this.openSnackBar('An error occured: ' + err, 'error'),
                            () => this.resetForms())
                    })
                },
            )
        } else {
            this.openSnackBar('No stock foto or/and icon, but its necessary for a subcategory!', 'error')
        }

    }

    deleteSubcategory(category: Category, subcategory): void {
        if (confirm('Are you sure to delete Subcategory ' + subcategory.name +
            '\nYou are not able to find the related events again')) {
            category.subcategories = category.subcategories.filter(subcat => subcat.name !== subcategory.name)
            this.categoryService.updateCategory(category._id, category).subscribe()
        }
    }

    iconChosen(event: any) {
        if (event.target.value) {
            this.icon = (event.target.files[0] as File);
            this.chosen = true
        }
    }

    stockImageChosen(event: any) {
        if (event.target.value) {
            this.stockImage = (event.target.files[0] as File);
            // this.chosen = true
        }
    }

    downloadImage(categories) {
        categories.forEach(cat => {
            let IconUrl = null
            let StockImageURL = null

            if (cat.iconPath !== undefined) {
                if (cat.iconTemporaryURL === undefined) {
                    this.fileService.downloadFile(cat.iconPath).subscribe(imageData => {
                        // create temporary Url for the downloaded image and bypass security
                        const unsafeImg = URL.createObjectURL(imageData);
                        IconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                        cat.iconTemporaryURL = IconUrl
                    })
                    this.fileService.downloadFile(cat.stockImagePath).subscribe(imageData => {
                        // create temporary Url for the downloaded image and bypass security
                        const unsafeImg = URL.createObjectURL(imageData);
                        StockImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                        cat.stockImageTemporaryURL = StockImageURL
                    })
                }
            }
            if (cat.subcategories.length > 0) {
                cat.subcategories.forEach(sub => {
                    if (sub.iconPath !== undefined) {
                        if (sub.iconTemporaryURL === undefined) {
                            this.fileService.downloadFile(sub.iconPath).subscribe(imageData => {
                                // create temporary Url for the downloaded image and bypass security
                                const unsafeImg = URL.createObjectURL(imageData);
                                IconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                                sub.iconTemporaryURL = IconUrl;
                            })
                            this.fileService.downloadFile(sub.stockImagePath).subscribe(imageData => {
                                // create temporary Url for the downloaded image and bypass security
                                const unsafeImg = URL.createObjectURL(imageData);
                                StockImageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                                sub.stockImageTemporaryURL = StockImageURL
                            })
                        }
                    }
                })
            }
        })
    }

    clickSubcategory(id) {
        if (id === this.clickedSubcategory) {
            this.clickedSubcategory = 0
        } else {
            this.clickedSubcategory = id
        }
    }

    updateCategory() {
        const category = this.updateCategoryObject
        category.name = this.categoryName.value;

        if (this.icon && this.icon.size > this.uploadedIconSize) {
            this.openSnackBar('File size too big!', 'error')
            this.resetForms()
            return
        }
        if (this.icon && !this.allowedImageTypes.includes(this.icon.type)) {
            this.openSnackBar('File type ' + this.icon.type + ' is not allowed', 'error')
            this.resetForms()
            return
        }
        if (this.icon) {
            const categoryImagePath = this.iconPath + category._id
            const formdata: FormData = new FormData();
            formdata.append('files', this.icon);
            formdata.append('file_path', categoryImagePath)
            // TODO delete old Icon
            this.fileService.uploadCategoryFiles(formdata).subscribe((response) => {

                category.iconPath = response.icon.path
                this.categoryService.updateCategory(category._id, category).subscribe(
                    categoryResponse => this.openSnackBar('Successfully uploaded category: ' + categoryResponse.name, 'success'),
                    err => this.openSnackBar('An error occured: ' + err, 'error'),
                )
            })

            this.resetForms()
        }
        if (this.stockImage) {
            const categoryStockImagePath = this.iconPath + category._id
            const formdata: FormData = new FormData();
            formdata.append('files', this.stockImage);
            formdata.append('stockImagePath', categoryStockImagePath)
            // TODO delete old Icon
            this.fileService.uploadCategoryFiles(formdata).subscribe((response) => {


                category.stockImagePath = response.stockImage.path
                this.categoryService.updateCategory(category._id, category).subscribe(
                    categoryResponse => this.openSnackBar('Successfully uploaded category: ' + categoryResponse.name, 'success'),
                    err => this.openSnackBar('An error occured: ' + err, 'error'),
                )
            })

            this.resetForms()
        } else if (!this.icon && !this.stockImage) {
            this.categoryService.updateCategory(category._id, category).subscribe(
                categoryResponse => this.openSnackBar('Successfully uploaded category: ' + categoryResponse.name, 'success'),
                err => this.openSnackBar('An error occured: ' + err, 'error'),
            )
            this.resetForms()
        }
    }

    updateSubcategory(category) {
        const icon = this.icon;
        const stockImage = this.stockImage
        if (this.icon && this.icon.size > this.uploadedIconSize) {
            this.openSnackBar('File size too big!', 'error')
            this.resetForms()
            return
        }
        if (this.icon && !this.allowedImageTypes.includes(this.icon.type)) {
            this.openSnackBar('File type ' + this.icon.type + ' is not allowed', 'error')
            this.resetForms()
            return
        }
        if (icon) {
            const subcategory = this.updateSubcategoryObject
            subcategory.name = this.subcategoryName.value

            this.categoryService.updateCategory(category._id, category).subscribe(
                catRes => {
                    category = catRes
                    const subcategoryIconPath = this.iconPath + catRes._id + '/' + subcategory._id
                    const formdata: FormData = new FormData();
                    formdata.append('files', icon);
                    console.log('lol', icon, formdata)
                    formdata.append('file_path', subcategoryIconPath)
                    this.fileService.uploadCategoryFiles(formdata).subscribe(response => {
                        category.subcategories.map(sub => {
                            if (sub._id === subcategory._id) {
                                sub.iconPath = response.icon.path
                            }
                        })
                        this.categoryService.updateCategory(category._id, category).subscribe(
                            () => this.openSnackBar('Successfully uploaded subcategory: ' + subcategory.name, 'success'),
                            err => this.openSnackBar('An error occured: ' + err, 'error'))
                    })
                },
            )
        }
        if (stockImage) {
            const subcategory = this.updateSubcategoryObject
            subcategory.name = this.subcategoryName.value

            this.categoryService.updateCategory(category._id, category).subscribe(
                catRes => {
                    category = catRes
                    const subcategoryStockImagePath = this.stockImagePath + catRes._id + '/' + subcategory._id
                    const formdata: FormData = new FormData();
                    formdata.append('files', stockImage);
                    formdata.append('stockImagePath', subcategoryStockImagePath)
                    // TODO delete old Icon
                    this.fileService.uploadCategoryFiles(formdata).subscribe((response) => {
                        category.subcategories.map(sub => {
                            if (sub._id === subcategory._id) {
                                sub.stockImagePath = response.stockImage.path
                            }
                        })
                        this.categoryService.updateCategory(category._id, category).subscribe(
                            categoryResponse => this.openSnackBar('Successfully uploaded category: ' + categoryResponse.name, 'success'),
                            err => this.openSnackBar('An error occured: ' + err, 'error'),
                        )
                    })
                },
            )
        } else if (!this.icon && !this.stockImage) {
            const subcategory = this.updateSubcategoryObject
            subcategory.name = this.subcategoryName.value

            this.categoryService.updateCategory(category._id, category).subscribe(
                () => this.openSnackBar('Successfully updated subcategory: ' + subcategory.name, 'success'),
                err => this.openSnackBar('An error occured: ' + err, 'error'),
                () => this.resetForms())
        }
    }

    editCategoryClicked(category) {
        const value = this.categoryName.value !== category.name ? category.name : '';
        this.update = !this.update;
        this.updateCategoryObject = category
        this.categoryName.setValue(value)
    }

    editSubcategoryClicked(category, sub) {

        const value = this.subcategoryName.value !== sub.name ? sub.name : '';
        this.updateSub = !this.updateSub;
        this.updateSubcategoryObject = sub
        this.subcategoryName.setValue(value)
    }


    openSnackBar(message, state) {

        this._snackbar.open(message, '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

        });
    }

    resetForms() {
        this.categoryName.reset();
        this.subcategoryName.reset();
        this.icon = null;
        this.inputCat.nativeElement.value = '';
        this.inputCat2.nativeElement.value = '';
        this.inputSubcat.nativeElement.value = '';
        this.updateCategoryObject = null;
        this.update = false;
        this.updateSubcategoryObject = null;
        this.updateSub = false;
    }

}
