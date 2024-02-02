import { Component, Input, OnInit } from "@angular/core";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";

@Component({
  selector: "vents-google-ads",
  templateUrl: "./google-ads.component.html",
  styleUrls: ["./google-ads.component.css"],
})
export class GoogleAdsComponent implements OnInit {
  @Input() percentageActivated: boolean = false;
  percentage = 0;
  isAdEnabled = false;
  constructor(private sharedObservableService: SharedObservableService) {}
  ngOnInit(): void {
    this.sharedObservableService.settingsObservable.subscribe((settings) => {
      this.percentage = this.percentageActivated
        ? settings?.percentagOfAd
        : 100;
      this.isAdEnabled = this.isRandomTrue() && settings?.isAdsActivated;
    });
  }
  ngAfterViewInit() {
    try {
      (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
    } catch (e) {}
  }
  isRandomTrue(): boolean {
    const randomNumber = Math.random() * 100; // generates a random number between 0 and 1

    // Return true 20% of the time
    return randomNumber <= this.percentage;
  }
}
