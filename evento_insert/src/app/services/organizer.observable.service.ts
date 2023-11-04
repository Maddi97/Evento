import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { createEventFromOrg } from '../pages/organizer/organizer-view/organizer.helpers';
import { EventsService } from './events.web.service';
import { FileUploadService } from './files/file-upload.service';
import { NominatimGeoService } from './location/nominatim-geo.service';
import { OrganizerService } from './organizer.web.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerObservableService {

  organizerImagePath = 'images/organizerImages/';

  constructor(
    private _snackbar: MatSnackBar,
    private geoService: NominatimGeoService,
    private eventService: EventsService,
    private fileService: FileUploadService,
    private organizerService: OrganizerService,
    public dialog: MatDialog
  ) { }

  addNewOrganizer(organizer): Observable<organizer> {
    // create organizerObject From FormField organizerForm
    const org = organizer
    const address = org.address

    // first fetch geo data from osm API and than complete event data type and send to backend
    this.geoService.get_geo_data(address.city, address.street, address.streetNumber)
      .pipe(
        map(
          geoData => {
            if (Object.keys(geoData).length < 1) {
              throw new Error('No coordinates found to given address');
            }
            org.geoData.lat = geoData[0].lat;
            org.geoData.lon = geoData[0].lon;

            this.organizerService.createOrganizer(org)
              .pipe(
                map(
                  createOrganizerResponse => {
                    const _id = createOrganizerResponse._id;
                    // upload image
                    org._id = createOrganizerResponse._id
                    const formdata = org.fd
                    // fd only for passing formdata form input
                    delete org.fd
                    if (formdata !== undefined) {
                      const fullEventImagePath = this.organizerImagePath + createOrganizerResponse._id
                      formdata.append('organizerImagePath', fullEventImagePath)
                      this.fileService.uploadOrganizerImage(formdata).subscribe(
                        uploadImageResponse => {
                          org.organizerImagePath = uploadImageResponse.organizerImage.path
                          this.organizerService.updateOrganizer(_id, org).subscribe()
                        })
                    }

                    if (createOrganizerResponse.isEvent === true) {
                      // if org is event than create also an event object
                      const event = createEventFromOrg(org)
                      event._organizerId = _id
                      this.eventService.createEvent(event).subscribe(
                        (eventResponse) => {
                          org.ifEventId = eventResponse._id
                          this.organizerService.updateOrganizer(_id, org).subscribe(
                          )
                        }
                      )
                    }
                    // spezifisch für crawler
                    //                    this.organizerIn.push(createOrganizerResponse)
                  }),
              )
          }
        ))
  }
}
