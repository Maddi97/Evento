import { InputParameter } from "@shared/services/crawler/crawler-api.service";
import { of, throwError } from "rxjs";
import {
  catchError,
  concatMap,
  delay,
  map,
  mergeMap,
  retry,
  switchMap,
} from "rxjs/operators";
import { waitForRobotToFinish } from "./waitForRobotToFinish";

export function crawlBrowseAi(crawler, url, crawlerService, crawlerName) {
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
          delay(1000),
          switchMap((res) =>
            retryWaitingForResultIfFailed(crawler, res, crawlerService)
          ),
          catchError(() => {
            return of({ capturedLists: { linklist: [] } });
          }),
          map((res) => {
            const linkList = res["capturedLists"]?.linklist || [];
            if (linkList.length === 0) {
              console.error("No links found of task", res);
            }
            return linkList
              .filter((event) => !!event.link)
              .map((event) => ({ originUrl: event.link }));
          }),
          // run a bulk task of the second robot with the links as input parameters
          switchMap((inputParameters: InputParameter[]) => {
            return crawlerService.runBulkTaskOfRobot(
              crawler.secondRobotId,
              inputParameters
            );
          }),
          delay(2000),
          // wait until robot is finished
          switchMap((res: any) => {
            console.log("Task 3 response: ", res);
            return waitForRobotToFinish(
              "bulk",
              crawler.secondRobotId,
              res["result"]["bulkRun"].id,
              crawlerService
            );
          }), // get the task ids of the single tasks finished  by the bulk task of the robot
          // map the task ids as list
          map((events: any) => {
            const crawledEvents = events["robotTasks"]?.items || [];
            if (crawledEvents.length === 0) {
              console.error("No links found of bulk run: ", events);
            }
            events = crawledEvents.map((item) => {
              return {
                ...item.capturedTexts,
                link: item.inputParameters.originUrl,
                crawlerName,
              };
            });
            if (events.length !== 0) {
              sessionStorage.setItem(url, JSON.stringify(events));
            }
            return events;
          })
        )
    );
  }
}

export function retryWaitingForResultIfFailed(crawler, res, crawlerService) {
  return waitForRobotToFinish(
    "task",
    crawler.robotId,
    res["result"].id,
    crawlerService
  ).pipe(
    mergeMap((res) =>
      res["status"] === "failed" ? throwError(() => "Task failed!") : of(res)
    ),
    retry(3)
  );
}
