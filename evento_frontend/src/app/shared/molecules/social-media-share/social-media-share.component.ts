import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { Share } from "@capacitor/share";
import { DeviceDetectorService } from "ngx-device-detector";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule, isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-social-media-share",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ClipboardModule],
  templateUrl: "./social-media-share.component.html",
  styleUrls: ["./social-media-share.component.css"],
})
export class SocialMediaShareComponent implements OnInit {
  url: string;
  shareText = "Schau dir dieses Event an, dass ich auf Evento gefunden habe!";
  whatsappLink;
  isDeviceMobile: boolean;
  faWhatsapp = faWhatsapp;
  faTelegram = faTelegram;

  constructor(
    private _snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.url = window.location.href;
      this.whatsappLink = encodeURI(
        `https://wa.me?text=${this.shareText + "\n" + this.url}`
      );
    }
  }

  ngOnInit(): void {
    this.isDeviceMobile = this.deviceService.isMobile();
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async shareOnPhone() {
    await Share.share({
      title: "Share Event",
      text: this.shareText,
      url: this.url,
      dialogTitle: "Teile das Event mit Freunden",
    }).then(() => console.log("Sharing successful"));
  }

  openSnackBar(message) {
    this._snackbar.open(message, "", {
      duration: 2000,
      verticalPosition: "bottom",
      horizontalPosition: "center",
      panelClass: ["green-snackbar"],
    });
  }
}
