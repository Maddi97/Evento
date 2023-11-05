import { Component, OnInit } from '@angular/core';
import { Organizer } from 'src/app/models/organizer';
import { OrganizerService } from 'src/app/services/organizer.web.service';
import { SnackbarService } from 'src/app/services/utils/snackbar.service';
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
  index = 0;

  constructor(
    private crawlerService: CrawlerApiService,
    private snackbar: SnackbarService,
    private organizerService: OrganizerService,
  ) {

  }
  ngOnInit(): void {
    this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[this.index])
    this.organizerService.getOrganizer().subscribe(
      (org) => {
        this.allOrganizer = org;
      }
    )
  }
  nextEvent() {
    if (this.index === this.insertEventList.length - 1) {
      console.error("Index too big. Not that many Elements in the list.")
    }
    else {
      this.index++;
      this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[this.index])
    }
  }
  previousEvent() {
    if (this.index === 0) {
      console.error("Index smaller than 0.")
    }
    else {
      this.index--;
      this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[this.index])
    }
  }
  getRobots() {
    this.crawlerService.getRobots().subscribe(res => {
      this.message = res['messageCode']
    })
  }
  setIndex(index) {
    this.index = Number(index);
    if (index > this.insertEventList.length) {
      console.error("Index too big. Not that many Elements in the list.")
    }
    else if (index < 0) {
      console.error("Index smaller than 0.")
    }
    else {
      this.eventIn = this.hilfsFunktionMapProperties(this.insertEventList[this.index])
    }

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
          this.snackbar.openSnackBar(error.error, 'error')
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
            this.snackbar.openSnackBar(error.error, 'error')
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

}
