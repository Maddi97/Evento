import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { ControlContainer, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-select-files-form",
  standalone: true,
  imports: [],
  templateUrl: "./select-files-form.component.html",
  styleUrl: "./select-files-form.component.css",
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class SelectFilesFormComponent implements OnInit, OnDestroy {
  parentContainer = inject(ControlContainer);
  formDataControl = new FormControl(null);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl("fd", this.formDataControl);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl("fd");
  }

  selectFile(file: File) {
    if (file) {
      const formdata: FormData = new FormData();
      formdata.append("files", file);
      this.formDataControl.setValue(formdata);
    } else {
      this.formDataControl.setValue(undefined);
    }
  }
}
