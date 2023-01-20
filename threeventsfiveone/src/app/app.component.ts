import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router"


@Component({
  selector: 'vents-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'threeventsfiveone';
  private cookieMessage = 'Diese Website verwendet nur essenzielle Cookies. Erfahrunge mehr über die verwendeten Cookies in unsererem Datenschutzbereich' +
    ''
  private cookieDismiss = 'Verstanden!'
  private cookieLinkText = 'Hier gehts zur Datenschutzerklärung'

  constructor(private router: Router) {
  }


  ngOnInit(): void {
    const cc = window as any;
    cc.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#164969'
        },
        button: {
          background: '#ffe000',
          text: '#164969'
        }
      },
      theme: 'classic',
      content: {
        message: this.cookieMessage,
        dismiss: this.cookieDismiss,
        link: this.cookieLinkText,
        href: window.location.href + '/settings'
      }
    });
  }
}

