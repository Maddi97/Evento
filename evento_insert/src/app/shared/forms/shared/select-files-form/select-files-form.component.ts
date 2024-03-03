import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_ICON_SIZE,
  ALLOWED_IMAGE_SIZE,
} from "@globals/constants/files.c";

@Component({
  selector: "app-select-files-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./select-files-form.component.html",
  styleUrl: "./select-files-form.component.css",
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class SelectFilesFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) formControlRegisterName: string;
  @Input() validationType: "Icon" | "Image" | null;
  parentContainer = inject(ControlContainer);
  formDataControl = new FormControl(null, [
    this.fileTypeValidator(),
    this.fileSizeValidator(),
  ]);
  file: File;
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.formControlRegisterName,
      this.formDataControl
    );
    this.parentFormGroup
      .get(this.formControlRegisterName)
      .valueChanges.subscribe((value) => {
        if (!value) {
          this.reset();
        }
      });
  }
  ngOnChanges() {
    this.formDataControl.updateValueAndValidity();
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.formControlRegisterName);
  }

  selectFile(file: File) {
    if (file) {
      this.file = file;
      const formdata: FormData = new FormData();
      formdata.append("files", file);
      this.formDataControl.setValue(formdata);
    } else {
      this.formDataControl.setValue(undefined);
    }
  }
  reset() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  }
  fileTypeValidator(): ValidatorFn {
    const allowedTypes = ALLOWED_IMAGE_TYPES;
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.validationType) return null;
      if (!this.file) {
        return { required: true }; // No file selected, no validation error
      }
      if (!allowedTypes.includes(this.file.type)) {
        return { invalidFileType: true }; // Validation error for invalid file type
      }
      return null; // File type is valid
    };
  }
  fileSizeValidator(): ValidatorFn {
    const maxSize =
      this.validationType === "Icon" ? ALLOWED_ICON_SIZE : ALLOWED_IMAGE_SIZE;
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.file) {
        return null; // No file selected, no validation error
      }
      if (!this.validationType) return null;

      if (this.file.size > maxSize) {
        return { invalidFileSize: true }; // Validation error for invalid file size
      }
      return null; // File size is valid
    };
  }
}
