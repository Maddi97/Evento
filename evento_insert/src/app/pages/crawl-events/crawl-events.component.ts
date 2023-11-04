import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Organizer } from 'src/app/models/organizer';
import { EventsService } from 'src/app/services/events.web.service';
import { OrganizerService } from 'src/app/services/organizer.web.service';
import { crawlerConfig } from '../../../constants/browseAi';
import { CrawlerApiService } from '../../services/crawler/crawler-api.service';
import { crawlerMockdata } from '../crawl-events/testdata';


@Component({
  selector: 'app-crawl-events',
  templateUrl: './crawl-events.component.html',
  styleUrls: ['./crawl-events.component.css']
})
export class CrawlEventsComponent implements OnInit {
  //TODO remove test

  testTaskId = '37b74596-318a-4715-97e0-c8d5e1cac719'

  message;
  crawlerConfig = crawlerConfig;
  crawlerNames = Object.keys(crawlerConfig)
  selectedCrawler: keyof typeof crawlerConfig = 'urbanite';
  insertEventList: any[] = crawlerMockdata;
  allOrganizer: Organizer[] = []
  eventIn: any;
  organizer$

  constructor(
    private crawlerService: CrawlerApiService,
    private _snackbar: MatSnackBar,
    private organizerService: OrganizerService,
    private eventService: EventsService
  ) {

  }
  ngOnInit(): void {
    this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[0])
    this.organizerService.getOrganizer().subscribe(
      (org) => {
        this.allOrganizer = org;
      }
    )
  }
  nextEvent() {
    this.insertEventList.shift()
    this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[0])
  }
  getRobots() {
    this.crawlerService.getRobots().subscribe(res => {
      this.message = res['messageCode']
    })
  }

  getResultsOfRobot(crawler, taskId) {
    //TODO setIntervall until task is done
    this.crawlerService.getResultOfRobot(crawler.robotId, this.testTaskId).pipe(
    ).subscribe(
      {
        next: (res) => {
          this.insertEventList = res;
        },
        error: (error) => {
          // Handle error here
          this.openSnackBar(error.error, 'error')
          console.error('An error occurred while fetching categories', error.error);
        },
        complete: () => {
        }
      }
    )
  }

  runTaskOfRobot(crawlerKey: string) {
    const crawler = crawlerConfig[crawlerKey];
    if (!true) {
      this.crawlerService.runTaskOfRobot(crawler.robotId, crawler.inputUrl).subscribe(
        {
          next: (res) => {
            console.log(res)
            // getTaskId
            this.getResultsOfRobot(crawler, res['data'].taskId)
          },
          error: (error) => {
            // Handle error here
            this.openSnackBar(error.error, 'error')
            console.error('An error occurred while fetching categories', error.error);
          },
          complete: () => {
          }
        }
      )
    }
    else {
      this.getResultsOfRobot(crawler, '')
    }
  }

  hilfsFunktionMapProperties(eventIn) {
    return {
      date: { start: eventIn.date },
      times: { start: eventIn.start_time },
      category: eventIn.category,
      name: eventIn.event_name,
      organizerName: eventIn.organizer_name
    }
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: state !== "error" ? "green-snackbar" : "red-snackbar",
    });
  }

}
