import { MAX_RETRIES_TASK_FAILED } from "@globals/constants/browseAI.c";
import {
  CrawlerApiService,
  InputParameter,
} from "@shared/services/crawler/crawler-api.service";
import { of, throwError } from "rxjs";
import {
  catchError,
  concatMap,
  delay,
  map,
  retryWhen,
  switchMap,
  take,
  tap,
} from "rxjs/operators";
import { waitForRobotToFinish } from "./waitForRobotToFinish";
import { StoreDatasetService } from "@shared/services/store-dataset/store-dataset.service";

export function crawlBrowseAi(
  crawler,
  url,
  crawlerService: CrawlerApiService,
  storeDatasetService: StoreDatasetService,
  crawlerName
) {
  const storedValue = sessionStorage.getItem(url);
  if (storedValue) {
    // If the URL has been called before, return the stored value
    return of(JSON.parse(storedValue));
  } else {
    return (
      crawlerService
        //run task of robot to gather links of events
        .runTaskOfRobot(crawler.robotId, url)
        .pipe(
          // wait until robot is finished
          tap(() => console.log("Start crawling ", url)),
          delay(1000),
          switchMap((res) =>
            retryWaitingForResultIfFailed(
              "task",
              crawler.robotId,
              res["result"].id,
              crawlerService,
              url
            )
          ),
          catchError((error) => {
            console.error("Error when waiting for tasks - ", error);
            return of({ capturedLists: { linklist: [] } });
          }),
          // store crawled information in dataset
          switchMap((res) => {
            let linkList = res["capturedLists"]?.linklist || [];
            linkList = linkList
              .filter((event) => !!event.link)
              .map((event) => event.link);
            storeDatasetService
              .storeLinklistDataset(url, linkList)
              .subscribe((r) => console.log(r));
            return of(res);
          }),
          map((res) => {
            let linkList = res["capturedLists"]?.linklist || [];
            linkList = linkList
              .filter((event) => !!event.link)
              .map((event) => ({ originUrl: event.link }));
            // console.log(`${url} - links: ${linkList.map((e) => e.originUrl)}`);

            if (linkList.length === 0) {
              sessionStorage.setItem(url, JSON.stringify([]));
              throw new Error(`No Event links found in ${url}`);
            } else {
              return linkList;
            }
          }),
          // run a bulk task of the second robot with the links as input parameters
          switchMap((inputParameters: InputParameter[]) => {
            return crawlerService.runBulkTaskOfRobot(
              crawler.secondRobotId,
              inputParameters
            );
          }),
          // wait until robot is finished
          switchMap((res) => {
            if (!res["result"]) return of({});
            return retryWaitingForResultIfFailed(
              "bulk",
              crawler.secondRobotId,
              res["result"]?.["bulkRun"]?.id,
              crawlerService,
              url
            );
          }),
          switchMap((res) => {
            const crawledEvents = res["robotTasks"]?.items || [];
            const events = crawledEvents.map((item) => {
              return {
                ...item.capturedTexts,
                link: item.inputParameters.originUrl,
              };
            });
            storeDatasetService
              .storeEventDetailsDataset(events)
              .subscribe((r) => console.log(r));
            return of(res);
          }),
          // get the task ids of the single tasks finished  by the bulk task of the robot
          // map the task ids as list
          map((events: any) => {
            const crawledEvents = events["robotTasks"]?.items || [];
            events = crawledEvents.map((item) => {
              return {
                ...item.capturedTexts,
                link: item.inputParameters.originUrl,
                crawlerName,
              };
            });
            console.log(`Events of bulk run: ${url} - `, events);
            sessionStorage.setItem(url, JSON.stringify(events));
            if (events.length === 0) {
              throw new Error(`No Events found for crawler: ${url}`);
            }
            return events;
          }),
          catchError((error) => {
            console.error(error);
            return of([]);
          })
        )
    );
  }
}

export function retryWaitingForResultIfFailed(
  taskOrBulk: "task" | "bulk",
  crawlerId,
  runId,
  crawlerService: CrawlerApiService,
  url
) {
  return waitForRobotToFinish(
    taskOrBulk,
    crawlerId,
    runId,
    crawlerService,
    url
  ).pipe(
    switchMap((res: any) => {
      const retryFailCondition =
        taskOrBulk === "task"
          ? res["status"] === "failed" || !res["status"]
          : res.message;
      if (retryFailCondition) {
        return throwError(
          () => new Error(`${taskOrBulk} failed! - ${res?.message}`)
        );
      } else {
        return of(res);
      }
    }),
    retryWhen((errors) =>
      errors.pipe(
        tap((error) =>
          //console.error(url, "Error occurred, retrying...", error.message || error)
          console.log("")
        ),
        concatMap((error, attemptNumber) => {
          if (attemptNumber === MAX_RETRIES_TASK_FAILED - 1) {
            return throwError(
              () => new Error("Maximum retry attempts reached")
            );
          }
          return of(error).pipe(delay(5000)); // Wait 3 seconds before retrying
        })
      )
    )
  );
}
