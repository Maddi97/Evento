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
  mergeMap,
  retry,
  retryWhen,
  switchMap,
  take,
  tap,
} from "rxjs/operators";
import { waitForRobotToFinish } from "./waitForRobotToFinish";
import { URL, Url } from "url";

export function crawlBrowseAi(
  crawler,
  url,
  crawlerService: CrawlerApiService,
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
          map((res) => {
            let linkList = res["capturedLists"]?.linklist || [];
            linkList = linkList
              .filter((event) => !!event.link)
              .map((event) => ({ originUrl: event.link }));
            // console.log(`${url} - links: ${linkList.map((e) => e.originUrl)}`);

            if (linkList.length === 0) {
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
            console.log(`Run bulk response of ${url} - `, res);
            if (!res["result"]) return of({});
            return retryWaitingForResultIfFailed(
              "bulk",
              crawler.secondRobotId,
              res["result"]?.["bulkRun"]?.id,
              crawlerService,
              url
            );
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
            if (events.length !== 0) {
              sessionStorage.setItem(url, JSON.stringify(events));
            } else {
              throw new Error(`No Events found for crawler: ${url}`);
            }
            return events;
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
  const maxRetries = 3;
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
          console.error("Error occurred, retrying...", error || error.message)
        ),
        delay(5000), // Adjust the delay time as needed
        take(maxRetries), // Maximum number of retry attempts
        concatMap((error, attemptNumber) => {
          if (attemptNumber === maxRetries - 1) {
            return throwError(
              () => new Error("Maximum retry attempts reached")
            );
          }
          return of(error);
        })
      )
    )
  );
}
