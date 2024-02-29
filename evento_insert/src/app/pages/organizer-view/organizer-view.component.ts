import { Component, OnDestroy, OnInit } from "@angular/core";
import { concatMap, map } from "rxjs/operators";
import { Category } from "@globals/models/category";
import { Organizer } from "@globals/models/organizer";
import { OrganizerService } from "@shared/services/organizer/organizer.web.service";

import { DomSanitizer } from "@angular/platform-browser";
import { CategoryService } from "@shared/services/category/category.service";
import { OrganizerObservableService } from "@shared/services/organizer/organizer.observable.service";
import { SnackbarService } from "@shared/services/utils/snackbar.service";
import { FileUploadService } from "@shared/services/files/file-upload.service";
import { CommonModule } from "@angular/common";
import { OrganizerFormComponent } from "@shared/forms/organizer/organizer-form/organizer-form.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MapViewComponent } from "@shared/molecules/map-view/map-view.component";

@Component({
  selector: "app-organizer-view",
  standalone: true,
  imports: [
    CommonModule,
    OrganizerFormComponent,
    MatExpansionModule,
    MapViewComponent,
  ],
  templateUrl: "./organizer-view.component.html",
  styleUrls: ["./organizer-view.component.css"],
})
export class OrganizerViewComponent implements OnInit, OnDestroy {
  organizers: Organizer[] = [];
  allOrganizer: Organizer[] = [];
  updateOrganizerId = "";
  ifEventId = "";
  isOpeningTimesRequired = false;
  category: Category;

  // subscriptions
  category$;
  categories;
  organizer$;
  createOrganizer$;
  updateOrganizer$;
  deleteOrganizer$;

  // organizer for form
  organizerInformation: Organizer;
  disabled = false;

  organizerImagePath = "images/organizerImages/";

  constructor(
    private organizerService: OrganizerService,
    private snackbarService: SnackbarService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private organizerOnservableService: OrganizerObservableService
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoryService.getCategories();
    this.category$.subscribe((cat) => (this.categories = cat));
    this.organizerService.getOrganizer().subscribe((organizer) => {
      this.allOrganizer = organizer;
    });
  }

  ngOnDestroy(): void {
    if (this.organizer$) {
      this.organizer$.unsubscribe();
    }
  }

  addNewOrganizer(organizer) {
    this.organizerOnservableService
      .addNewOrganizer(organizer)
      .then((organizerResponse) => {
        this.snackbarService.openSnackBar(
          "Successfully added: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbarService.openSnackBar(error, "error"));
  }

  updateOrganizer(organizer): void {
    this.organizerOnservableService
      .updateOrganizer(organizer)
      .then((organizerResponse) => {
        this.snackbarService.openSnackBar(
          "Successfully added: " + organizerResponse.name,
          "success"
        );
      })
      .catch((error) => this.snackbarService.openSnackBar(error, "error"));
  }

  deleteOrganizer(organizer: Organizer): void {
    if (
      confirm("Are you sure to delete the organizer and all related events???")
    ) {
      this.deleteOrganizer$ = this.organizerService.deleteOrganizer(
        organizer._id
      );
      this.deleteOrganizer$
        .pipe(
          concatMap(() =>
            this.fileService.deleteFile(organizer.organizerImagePath)
          )
        )
        .subscribe();
    }
  }

  downloadImage() {
    this.organizers.forEach((organizer) => {
      let imageURL = null;
      if (organizer.organizerImagePath !== undefined) {
        if (organizer.organizerImageTemporaryURL === undefined) {
          this.fileService
            .downloadFile(organizer.organizerImagePath)
            .subscribe((imageData) => {
              // create temporary Url for the downloaded image and bypass security
              const unsafeImg = URL.createObjectURL(imageData);
              imageURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
              organizer.organizerImageTemporaryURL = imageURL;
            });
        }
      }
    });
  }

  loadOrganizerOfCategory(category: Category) {
    this.organizerService
      .getOrganizerByCategoryId(category._id)
      .pipe(
        map((organizerList) => {
          this.organizers = organizerList;
          this.downloadImage();
        })
      )
      .subscribe();
  }
  loadAllOrganizer() {
    this.organizerService.getOrganizer().subscribe((organizer) => {
      this.organizers = organizer;
    });
  }
}
