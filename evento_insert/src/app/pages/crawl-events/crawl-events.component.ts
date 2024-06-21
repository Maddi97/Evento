import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CRAWLER_CONFIG } from "@globals/constants/crawlerConfig";
import { Event } from "@globals/models/event";
import { Organizer } from "@globals/models/organizer";
import { CrawlerApiService } from "@shared/services/crawler/crawler-api.service";
import { OrganizerService } from "@shared/services/organizer/organizer.web.service";
import { SnackbarService } from "@shared/services/utils/snackbar.service";
import moment from "moment";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { catchError, forkJoin, map, of } from "rxjs";
import { crawlBrowseAi } from "../../shared/logic/browse-ai-subscription-helpers/browseAI.subscription";
import { mapIfzToEvents } from "../../shared/logic/specific-crawler/ifz-helper";
import { mapLeipzigToEvents } from "../../shared/logic/specific-crawler/leipzig-helper";
import { mapUrbaniteToEvents } from "../../shared/logic/specific-crawler/urbanite-helper";
import { mapMeineFlohmaerkteToEvents } from "../../shared/logic/specific-crawler/meine-flohmaerkte-helper";
import { mapRausgegangenToEvents } from "../../shared/logic/specific-crawler/rausgegangen";

import { CrawledEventsToEventComponent } from "../../shared/molecules/crawled-events-to-event/crawled-events-to-event.component";
import { StoreDatasetService } from "@shared/services/store-dataset/store-dataset.service";
import { EventsService } from "@shared/services/events/events.web.service";
import { CategoryService } from "@shared/services/category/category.web.service";
import { Category } from "@globals/models/category";

export type PossibleCrawlerNames = keyof typeof CRAWLER_CONFIG | "All";

@Component({
  selector: "app-crawl-events",
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    CrawledEventsToEventComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: "./crawl-events.component.html",
  styleUrls: ["./crawl-events.component.css"],
})
export class CrawlEventsComponent implements OnInit {
  message;
  UNWANTED_CRAWLER_NAMES = ["ifz"];
  crawlerNames = [...Object.keys(CRAWLER_CONFIG), "All"].filter(
    (name) => !this.UNWANTED_CRAWLER_NAMES.includes(name)
  );
  selectedInputDate = new Date();
  crawledEventList: Event[] = [];
  actualEventsList: Event[] = [];
  allOrganizer: Organizer[] = [];
  inputNumberOfDays: number = 1;
  organizerIn: Organizer;
  eventIn: Event;
  organizer$;
  index = 0;
  linkList = [];
  actualCrawler: PossibleCrawlerNames = "urbanite";
  allCategories: Category[] = [];

  constructor(
    private crawlerService: CrawlerApiService,
    private snackbar: SnackbarService,
    private organizerService: OrganizerService,
    private spinner: NgxSpinnerService,
    private storeDatasetService: StoreDatasetService,
    private eventService: EventsService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.organizerService.getOrganizer().subscribe((org) => {
      this.allOrganizer = org;
    });
    this.eventService.getAllUpcomingEvents().subscribe((events) => {
      this.actualEventsList = events;
    });
    this.categoryService.getCategories().subscribe((categories) => {
      this.allCategories = categories;
    });
  }

  nextEvent() {
    if (this.index === this.crawledEventList.length - 1) {
      console.error("Index too big. Not that many Elements in the list.");
    } else {
      this.index++;
      this.eventIn = this.crawledEventList[this.index];
      this.findOrganizer();
    }
  }
  previousEvent() {
    if (this.index === 0) {
      console.error("Index smaller than 0.");
    } else {
      this.index--;
      this.eventIn = this.crawledEventList[this.index];
      this.findOrganizer();
    }
  }
  getRobots() {
    this.crawlerService.getRobots().subscribe((res) => {
      this.message = res["messageCode"];
    });
  }

  setIndex(index) {
    this.index = index;
    if (index > this.crawledEventList.length) {
      console.error("Index too big. Not that many Elements in the list.");
    } else if (index < 0) {
      console.error("Index smaller than 0.");
    } else {
      this.eventIn = this.crawledEventList[this.index];
      this.findOrganizer();
    }
  }

  startCrawling(crawlerKey: PossibleCrawlerNames) {
    this.actualCrawler = crawlerKey;
    if (crawlerKey === "All") {
      this.crawlAllCrawler();
    } else {
      const crawler = CRAWLER_CONFIG[crawlerKey];
      const [crawling$, mapCrawledEventsFunction] =
        this.crawlEventsOfSpecificCrawler(crawlerKey, crawler);
      crawling$.subscribe({
        next: (eventList) => {
          eventList = eventList.flat();

          console.log("Final crawled events: ", eventList);
          this.spinner.hide();
          this.crawledEventList = mapCrawledEventsFunction(
            eventList.flat(),
            this.allCategories,
            this.allOrganizer
          );
          let filteredOut = [];

          // check if event exists in database
          this.crawledEventList = this.crawledEventList.reduce((acc, event) => {
            const exists = this.actualEventsList.some(
              (e) => e.name === event.name && e.date.start === event.date.start
            );
            if (!exists) {
              acc.push(event);
            } else {
              filteredOut.push(event);
            }
            return acc;
          }, []);
          console.log("Filtered events: ", this.crawledEventList.length);
          console.log("filtered out events ", filteredOut);
          this.index = 0;
          const [completeEvents, incompleteEvents] = this.returnCompleteEvents(
            this.crawledEventList
          );
          console.log(
            "==================== Count already inserted ======================="
          );
          console.log("Complete Events. Already inserted: ", completeEvents);
          console.log(
            "Incomplete Events. Not inserted: ",
            incompleteEvents.length
          );
          console.log(
            "=================================================================="
          );

          this.crawledEventList = incompleteEvents;
          this.eventService.addMultipleEvents(completeEvents);
          this.eventIn = this.crawledEventList[this.index];

          this.findOrganizer();
          this.eventService;
        },
        error: (error) => {
          // Handle error here
          this.spinner.hide();
          this.snackbar.openSnackBar(error, "error", 5000);
          console.error(error);
        },
        complete: () => {
          console.log("complete");
          this.spinner.hide();
        },
      });
    }
  }
  crawlAllCrawler() {
    const observables = this.crawlerNames
      .map((crawlerName: PossibleCrawlerNames) => {
        if (crawlerName !== "All") {
          const crawler = CRAWLER_CONFIG[crawlerName];

          const [crawling$, mapCrawledEventsFunction] =
            this.crawlEventsOfSpecificCrawler(crawlerName, crawler);

          return crawling$.pipe(
            // Map the result using mapCrawledEventsFunction
            map((eventList: any) => {
              return mapCrawledEventsFunction(
                eventList.flat(),
                this.allCategories,
                this.allOrganizer
              );
            })
          );
        }
        return of(null); // Return an empty observable for 'All' crawler
      })
      .filter((obs) => obs !== null);
    const forkedSubscription = forkJoin(observables).subscribe({
      next: (results) => {
        console.log("Results of ForkedSubscription return: ", results);
        let filteredResult = results
          .filter((result) => result !== null && Object.keys(result).length > 0)
          .flat();

        let filteredOut = [];
        filteredResult = filteredResult.reduce((acc, event) => {
          const exists =
            filteredResult.some(
              (e) => e.name === event.name && e.date.start === event.date.start
            ) &&
            this.actualEventsList.some(
              (e) => e.name === event.name && e.date.start === event.date.start
            );
          if (!exists) {
            acc.push(event);
          } else {
            filteredOut.push(event);
          }
          return acc;
        }, []);
        console.log(`Filtered out ${filteredOut.length} events:`, filteredOut);
        if (filteredResult.length === 0) return;
        this.crawledEventList = filteredResult;
        this.index = 0;
        const [completeEvents, incompleteEvents] = this.returnCompleteEvents(
          this.crawledEventList
        );
        console.log(
          "==================== Count already inserted ======================="
        );
        console.log("Complete Events. Already inserted: ", completeEvents);
        console.log(
          "Incomplete Events. Not inserted: ",
          incompleteEvents.length
        );
        console.log(
          "=================================================================="
        );

        this.crawledEventList = incompleteEvents;
        this.eventService.addMultipleEvents(completeEvents);
        this.eventIn = this.crawledEventList[this.index];
        this.findOrganizer();
      },
      error: (error) => {
        // Handle error for forkJoin
        this.spinner.hide();

        this.snackbar.openSnackBar(
          error.message || error.error.text || error.error || error,
          "error",
          2000
        );
        forkedSubscription.unsubscribe();
        console.error("An error occurred while combining results", error);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  getUrlForCrawler(crawlerName: PossibleCrawlerNames, crawler, inputDate) {
    if (crawlerName === "urbanite") {
      return crawler.inputUrl + moment(inputDate).format("YYYY-MM-DD");
    }
    if (crawlerName === "leipzig") {
      const categories = crawler.categories;
      const url_categories = categories.map((category) => {
        return crawler.inputUrl.replace(
          /mksearch%5Bcategory%5D=\d+/,
          `mksearch%5Bcategory%5D=${category}`
        );
      });

      return url_categories.map((url) => {
        const customDate = new Date(inputDate);
        const customDateObj = new Date(customDate);

        // Extract day, month, and year components from the custom date
        const day = customDateObj.getDate().toString().padStart(2, "0");
        const month = (customDateObj.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Months are zero-based
        const year = customDateObj.getFullYear();

        const formattedDate = `${day}.${month}.${year}`;
        return url
          .replace(
            /mksearch%5Bdate_from%5D=\d{2}\.\d{2}\.\d{4}/,
            `mksearch%5Bdate_from%5D=${formattedDate}`
          )
          .replace(
            /mksearch%5Bdate_to%5D=\d{2}\.\d{2}\.\d{4}/,
            `mksearch%5Bdate_to%5D=${formattedDate}`
          );
      });
    } else {
      return crawler.inputUrl;
    }
  }

  crawlEventsOfSpecificCrawler(crawlerName: PossibleCrawlerNames, crawler) {
    this.spinner.show();

    let urls = [];
    for (let i = 0; i < this.inputNumberOfDays; i++) {
      urls.push(
        this.getUrlForCrawler(
          crawlerName,
          crawler,
          moment(this.selectedInputDate).add(i, "days").toDate()
        )
      );
      urls = urls.flat();
      console.log("Urls: ", urls);
    }
    let crawlings$;
    let mapCrawledEventsFunction: Function;

    switch (crawlerName) {
      case "urbanite": {
        crawlings$ = forkJoin(
          urls.map((url) =>
            //creates an observable for every date
            // if one observable fails it needs to return an empty list
            crawlBrowseAi(
              crawler,
              url,
              this.crawlerService,
              this.storeDatasetService,
              crawlerName
            ).pipe(
              catchError((error) => {
                console.error(`Error while crawling ${url}`, error);
                return of([]);
              })
            )
          )
        );
        mapCrawledEventsFunction = mapUrbaniteToEvents;
        break;
      }
      case "leipzig": {
        crawlings$ = forkJoin(
          urls.map((url) => {
            return crawlBrowseAi(
              crawler,
              url,
              this.crawlerService,
              this.storeDatasetService,
              crawlerName
            );
          })
        );
        mapCrawledEventsFunction = mapLeipzigToEvents;
        break;
      }
      case "ifz": {
        crawlings$ = crawlBrowseAi(
          crawler,
          urls[0],
          this.crawlerService,
          this.storeDatasetService,
          crawlerName
        ).pipe(
          catchError((error) => {
            console.error(`Error while crawling ${urls[0]}`, error);
            return of([]);
          })
        );
        mapCrawledEventsFunction = mapIfzToEvents;
        break;
      }
      case "meineFlohmaerkte": {
        crawlings$ = crawlBrowseAi(
          crawler,
          urls[0],
          this.crawlerService,
          this.storeDatasetService,
          crawlerName
        ).pipe(
          catchError((error) => {
            console.error(`Error while crawling ${urls[0]}`, error);
            return of([]);
          })
        );
        mapCrawledEventsFunction = mapMeineFlohmaerkteToEvents;
        break;
      }
      case "rausgegangen": {
        crawlings$ = crawlBrowseAi(
          crawler,
          urls[0],
          this.crawlerService,
          this.storeDatasetService,
          crawlerName
        ).pipe(
          catchError((error) => {
            console.error(`Error while crawling ${urls[0]}`, error);
            return of([]);
          })
        );
        mapCrawledEventsFunction = mapRausgegangenToEvents;
        break;
      }
    }
    return [crawlings$, mapCrawledEventsFunction];
  }
  findOrganizer() {
    if (!this.eventIn.organizerName)
      this.eventIn.organizerName = "NO ORGANIZER NAME";
    const filteredOrganizer = this.findOrganizerByName(this.eventIn);
    if (!filteredOrganizer) {
      this.organizerIn = new Organizer();
      this.organizerIn.name = this.eventIn.organizerName;

      this.organizerIn.category = this.eventIn.category
        ? this.eventIn.category
        : undefined;
      this.organizerIn.address.city = this.eventIn.address?.city
        ? this.eventIn.address.city
        : "";
      this.organizerIn.address.plz = this.eventIn.address?.plz
        ? this.eventIn.address.plz
        : "";
      this.organizerIn.address.street = this.eventIn.address?.street
        ? this.eventIn.address.street
        : "";
      this.organizerIn.address.country = this.eventIn.address?.country
        ? this.eventIn.address.country
        : "Deutschland";
      this.organizerIn.link = this.eventIn?.link;
    } else {
      //wenn es organizer gibt dann baue direkt das event
      this.organizerIn = filteredOrganizer;
      //todo Event befüllen

      const e = this.eventIn;
      e._organizerId = this.organizerIn._id;
      e.organizerName = this.organizerIn.name;
      if (!e.category?._id) {
        e.category = this.organizerIn.category;
      }
      if (!e.address.street) e.address = this.organizerIn.address;
      if (!e.description) e.description = this.organizerIn.description;
      this.eventIn = e;
    }
  }

  returnCompleteEvents(events) {
    const completeEvents = events.filter((event) => {
      const e = this.isEventComplete(event);
      if (e) {
        return e;
      }
    });
    const incompleteEvents = events.filter((event) => {
      const e = this.isEventComplete(event);
      if (!e) {
        return event;
      }
    });
    return [completeEvents, incompleteEvents];
  }

  isEventComplete(event: Event) {
    const hasOrganizer = (event._organizerId =
      this.findOrganizerByName(event)?._id);
    if (
      !!event.name &&
      !!event.date.start &&
      !!event.address.city &&
      !!event.address.street &&
      !!event.address.plz &&
      !!event.category._id &&
      !!hasOrganizer
    )
      return event;
    return undefined;
  }

  findOrganizerByName(event: Event) {
    return this.allOrganizer
      .filter(
        (organizer) =>
          organizer.name?.toLowerCase() ===
            event.organizerName?.toLowerCase() ||
          organizer.alias?.some(
            (aliasName: string) =>
              aliasName.toLowerCase() === event.organizerName?.toLowerCase()
          )
      )
      .pop();
  }

  selectOrganizerForCrawledEvent(organizer: Organizer) {
    this.eventIn.organizerName = organizer.name;
    this.findOrganizer();
  }
  newOrganizer(organizer) {
    this.eventIn.organizerName = organizer.name;
    this.allOrganizer.push(organizer);
    this.findOrganizer();
  }
  onDateChange(date: any): void {
    this.selectedInputDate = new Date(date);
  }
}
