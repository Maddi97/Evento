import { Component, OnInit } from '@angular/core';
import { PositionService } from './common-utilities/map-view/position.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Evento Leipzig';
  private cookieMessage = 'Diese Website verwendet nur essenzielle Cookies. Erfahrunge mehr über die verwendeten Cookies in unsererem Datenschutzbereich' +
    ''
  private cookieDismiss = 'Verstanden!'
  private cookieLinkText = 'Hier gehts zur Datenschutzerklärung'

  constructor(private positionService: PositionService) {
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

