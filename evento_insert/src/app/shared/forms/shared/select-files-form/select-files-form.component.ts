import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "app-select-files-form",
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
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
  @Input({ required: true }) formControlRegisterName: string;

  parentContainer = inject(ControlContainer);
  formDataControl = new FormControl(null);

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

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.formControlRegisterName);
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
  reset() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  }
}
