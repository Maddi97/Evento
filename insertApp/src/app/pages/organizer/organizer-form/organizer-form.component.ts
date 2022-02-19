import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {Organizer} from '../../../models/organizer';
import {Category} from '../../../models/category';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    getGeoDataTemplate,
    getOpeningTimesTemplate,
    getOrganizerFormTemplate,
    transformFormFieldToOrganizer
} from '../organizer-view/organizer.helpers';


@Component({
    selector: 'app-organizer-form',
    templateUrl: './organizer-form.component.html',
    styleUrls: ['./organizer-form.component.css']
})
export class OrganizerFormComponent implements OnInit, OnChanges {

    @Input() organizerIn: Organizer;
    @Output() updateOrganizer: EventEmitter<Organizer> = new EventEmitter<Organizer>();
    @Output() addNewOrganizer: EventEmitter<Organizer> = new EventEmitter<Organizer>();

    @ViewChild('imageUpload') inputImage: ElementRef;

    organizerForm: FormGroup = this.fb.group(getOrganizerFormTemplate())
    category: Category;
    openingTimes = getOpeningTimesTemplate()
    geoData = getGeoDataTemplate()
    updateOrganizerId = '';
    ifEventId;
    isOpeningTimesRequired = false;

    image: any;

    constructor(
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        if (this.organizerIn !== undefined) this.setOrganizerForm(this.organizerIn)
    }

    emitUpdate(organizerForm) {
        const organizer = transformFormFieldToOrganizer(organizerForm, this.category,
            this.openingTimes, this.geoData, this.updateOrganizerId)
        const formdata: FormData = new FormData();

        if (this.image !== undefined) {
            formdata.append('files', this.image);
            organizer['fd'] = formdata;
        } else organizer['fd'] = undefined
        this.updateOrganizer.emit(organizer)
    }

    emitAddOrganizer(organizerForm) {
        const organizer = transformFormFieldToOrganizer(organizerForm, this.category, this.openingTimes, this.geoData, '')

        const formdata: FormData = new FormData();
        if (this.image !== undefined) {
            formdata.append('files', this.image);
            organizer['fd'] = formdata;
        } else organizer['fd'] = undefined


        this.addNewOrganizer.emit(organizer)
    }

    iconChosen(event: any) {
        if (event.target.value) {
            this.image = (event.target.files[0] as File);
        }
    }

    setOrganizerForm(org: Organizer): void {

        this.organizerForm.setValue({
            name: org.name,
            city: org.address.city,
            plz: org.address.plz,
            street: org.address.street + ' ' + org.address.streetNumber,
            streetNumber: '',
            country: org.address.country,
            email: org.email,
            telephone: org.telephone,
            description: org.description,
            link: org.link,
            frequency: org.frequency,
            isEvent: String(org.isEvent)
        });
        this.category = org.category;
        this.openingTimes = org.openingTimes;
        this.updateOrganizerId = org._id;
        this.ifEventId = org.ifEventId;
        this.geoData = org.geoData

    }

    nullFormField() {
        this.isOpeningTimesRequired = false;
        this.organizerForm = this.fb.group(getOrganizerFormTemplate())

        this.openingTimes = getOpeningTimesTemplate()
        this.category = undefined
        this.updateOrganizerId = ''
        this.ifEventId = ''
        this.inputImage.nativeElement.value = '';

    }

    checkDisabled() {
        return !(!this.organizerForm.invalid && this.category !== undefined);
    }

    setCategory(category) {
        this.category = category
    }
}
