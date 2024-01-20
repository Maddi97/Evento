import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Settings } from "src/app/models/settings";

@Component({
  selector: "app-global-settings-form",
  templateUrl: "./global-settings-form.component.html",
  styleUrls: ["./global-settings-form.component.css"],
})
export class GlobalSettingsFormComponent implements OnInit, OnChanges {
  @Input() settings: Settings = {
    _id: "",
    isAdsActivated: false,
    isPromotionActivated: false,
  }; // Input object containing all settings variables
  @Output() applySettings = new EventEmitter<Settings>();

  settingsForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Initialize form with input settings
    this.settingsForm = this.formBuilder.group({
      isAdsActivated: this.settings?.isAdsActivated || false,
      isPromotionActivated: this.settings?.isPromotionActivated || false,
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.settings && this.settingsForm) {
      this.settingsForm.patchValue(changes.settings.currentValue);
    }
  }

  clearSettings(): void {
    // Reset form and emit event to clear settings
    this.settingsForm.reset({
      isAdsActivated: false,
      isPromotionActivated: false,
    });
  }

  applySettingsAndEmit(): void {
    // Emit event with current form values
    const settings: Settings = {
      ...this.settingsForm.value,
      _id: this.settings?._id || null,
    };
    this.applySettings.emit(settings);
  }
}
