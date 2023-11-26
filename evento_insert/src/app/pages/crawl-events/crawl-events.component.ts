import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Organizer } from "src/app/models/organizer";
import { OrganizerService } from "src/app/services/organizer.web.service";
import { SnackbarService } from "src/app/services/utils/snackbar.service";
import { crawlerConfig } from "../../../constants/browseAi";
import { CrawlerApiService } from "../../services/crawler/crawler-api.service";
import { crawlerMockdata } from "../crawl-events/testdata";
import { mapUrbaniteToEvents } from "./specific-crawler/urbanite-helper";
import { crawlUrbanite } from "./specific-crawler/urbanite-supscription";

export type PossibleCrawlerNames = keyof typeof crawlerConfig;

@Component({
  selector: "app-crawl-events",
  templateUrl: "./crawl-events.component.html",
  styleUrls: ["./crawl-events.component.css"],
})
export class CrawlEventsComponent implements OnInit {
  message;
  crawlerConfig = crawlerConfig;
  crawlerNames = Object.keys(crawlerConfig);
  selectedCrawler: keyof typeof crawlerConfig = "urbanite";
  crawledEventList: any[] = mapUrbaniteToEvents(crawlerMockdata);
  allOrganizer: Organizer[] = [];
  eventIn: any;
  organizer$;
  index = 0;
  linkList = [];

  constructor(
    private crawlerService: CrawlerApiService,
    private snackbar: SnackbarService,
    private organizerService: OrganizerService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.eventIn = this.crawledEventList[this.index];
    this.organizerService.getOrganizer().subscribe((org) => {
      this.allOrganizer = org;
    });
  }
  nextEvent() {
    if (this.index === this.crawledEventList.length - 1) {
      console.error("Index too big. Not that many Elements in the list.");
    } else {
      this.index++;
      this.eventIn = this.crawledEventList[this.index];
    }
  }
  previousEvent() {
    if (this.index === 0) {
      console.error("Index smaller than 0.");
    } else {
      this.index--;
      this.eventIn = this.crawledEventList[this.index];
    }
  }
  getRobots() {
    this.crawlerService.getRobots().subscribe((res) => {
      this.message = res["messageCode"];
    });
  }

  setIndex(index) {
    this.index = Number(index);
    if (index > this.crawledEventList.length) {
      console.error("Index too big. Not that many Elements in the list.");
    } else if (index < 0) {
      console.error("Index smaller than 0.");
    } else {
      this.eventIn = this.crawledEventList[this.index];
    }
  }

  startCrawling(crawlerKey: PossibleCrawlerNames) {
    const crawler = crawlerConfig[crawlerKey];
    this.crawlEventsOfSpecificCrawler(crawlerKey, crawler);
  }

  getUrlForCrawler(crawlerName: PossibleCrawlerNames, crawler) {
    if (crawlerName === "urbanite") {
      return (
        crawler.inputUrl +
        new Date(crawler.inputValue).toISOString().split("T")[0]
      );
    }
  }

  crawlEventsOfSpecificCrawler(crawlerName: PossibleCrawlerNames, crawler) {
    this.spinner.show();
    let url = this.getUrlForCrawler(crawlerName, crawler);
    let crawling$;

    switch (crawlerName) {
      case "urbanite":
        crawling$ = crawlUrbanite(crawler, url, this.crawlerService);
    }

    crawling$.subscribe({
      next: (eventList) => {
        console.log("Final crawled events: ", eventList);
        this.spinner.hide();
        crawling$.unsubscribe();
        this.crawledEventList = eventList;
      },
      error: (error) => {
        // Handle error here
        this.snackbar.openSnackBar(
          error.error.text || error.error || error,
          "error",
          2000
        );
        console.error("An error occurred while fetching", error.error);
        this.spinner.hide();
      },
      complete: () => {
        console.log("complete");
        this.spinner.hide();
      },
    });
  }
}
