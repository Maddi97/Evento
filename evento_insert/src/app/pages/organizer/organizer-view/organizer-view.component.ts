import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concatMap, map } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Organizer } from 'src/app/models/organizer';
import { OrganizerService } from 'src/app/services/organizer.web.service';
import { EventsService } from '../../../services/events.web.service';
import { NominatimGeoService } from '../../../services/location/nominatim-geo.service';

import { DomSanitizer } from "@angular/platform-browser";
import { CategoryService } from 'src/app/services/category.service';
import { OrganizerObservableService } from 'src/app/services/organizer.observable.service';
import { FileUploadService } from "../../../services/files/file-upload.service";

@Component({
    selector: 'app-organizer-view',
    templateUrl: './organizer-view.component.html',
    styleUrls: ['./organizer-view.component.css']
})
export class OrganizerViewComponent implements OnInit, OnDestroy {

    organizers: Organizer[] = [];
    updateOrganizerId = '';
    ifEventId = '';
    isOpeningTimesRequired = false;
    category: Category;

    // subscriptions
    category$
    categories
    organizer$;
    createOrganizer$;
    updateOrganizer$;
    deleteOrganizer$;

    // organizer for form
    organizerInformation: Organizer;
    disabled = false;

    organizerImagePath = 'images/organizerImages/';


    constructor(
        private organizerService: OrganizerService,
        private fb: FormBuilder,
        private _snackbar: MatSnackBar,
        private geoService: NominatimGeoService,
        private eventService: EventsService,
        private fileService: FileUploadService,
        private sanitizer: DomSanitizer,
        private categoryService: CategoryService,
        private organizerOnservableService: OrganizerObservableService

    ) {
    }

    ngOnInit(): void {
        this.category$ = this.categoryService.categories;
        this.category$.subscribe((cat) => (this.categories = cat));
    }

    ngOnDestroy(): void {
        if (this.organizer$) { this.organizer$.unsubscribe(); }
    }

    addNewOrganizer(organizer) {
        this.organizerOnservableService.addNewOrganizer(organizer).then(
            (organizerResponse) => {
                this.openSnackBar('Successfully added: ' + organizerResponse.name, 'success')
            }
        ).catch(
            (error) => this.openSnackBar(error, 'error')
        )
    }

    updateOrganizer(organizer): void {
        this.organizerOnservableService.updateOrganizer(organizer).then(
            (organizerResponse) => {
                this.openSnackBar('Successfully added: ' + organizerResponse.name, 'success')
            }
        ).catch(
            (error) => this.openSnackBar(error, 'error')
        )
    }

    deleteOrganizer(organizer: Organizer): void {
        if (confirm('Are you sure to delete the organizer and all related events???')) {

            this.deleteOrganizer$ = this.organizerService.deleteOrganizer(organizer._id)
            this.deleteOrganizer$.pipe(
                concatMap(
                    () => this.fileService.deleteFile(organizer.organizerImagePath)
                )
            ).subscribe();
        }
    }

    downloadImage() {
        this.organizers.forEach(organizer => {
            let imageURL = null
            if (organizer.organizerImagePath !== undefined) {
                if (organizer.organizerImageTemporaryURL === undefined) {
                    this.fileService.downloadFile(organizer.organizerImagePath).subscribe(imageData => {
                        // create temporary Url for the downloaded image and bypass security
                        const unsafeImg = URL.createObjectURL(imageData);
                        imageURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                        organizer.organizerImageTemporaryURL = imageURL
                    })
                }
            }
        })
    }

    loadOrganizerOfCategory(category) {
        this.organizerService.filterOrganizerByEventsCategory(category).pipe(
            map(o => {
                this.organizers = o;
                this.downloadImage()

            }
            )
        ).subscribe();
    }
    loadAllOrganizer() {
        this.organizerService.getOrganizer().subscribe((organizer) => {
            this.organizers = organizer
        })
    }

    openSnackBar(message, state) {
        this._snackbar.open(message, '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [state !== 'error' ? 'green-snackbar' : 'red-snackbar']

        });
    }


}
