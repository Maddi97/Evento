import { Component, inject } from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";

@Component({
  selector: "app-category-alias-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SelectionListComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./category-alias-form.component.html",
  styleUrl: "./category-alias-form.component.css",
})
export class CategoryAliasFormComponent {
  aliasFormControl: FormControl<Array<string>>;
  aliasInputControl: FormControl<string> = new FormControl("");
  parentContainer = inject(ControlContainer);
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.aliasFormControl = new FormControl([]);
    this.parentFormGroup.addControl("alias", this.aliasFormControl);
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl("alias");
  }
  pushAliasToForm() {
    const alias = this.aliasFormControl.value;
    alias.push(this.aliasInputControl.value);
    this.aliasFormControl.patchValue(alias);
    this.aliasInputControl.reset("");
  }
}
