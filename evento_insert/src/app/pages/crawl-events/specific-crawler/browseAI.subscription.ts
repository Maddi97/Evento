import { of, throwError } from "rxjs";
import { catchError, first, map, mergeMap, repeat } from "rxjs/operators";
import { InputParameter } from "../../../services/crawler/crawler-api.service";

export function crawlBrowseAi(crawler, url, crawlerService, crawlerName) {
  console.log("URL: ", url);
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
        mergeMap((res: any) => {
          console.log("Task 1 response: ", res);
          return waitForRobotToFinish(
            "task",
            crawler.robotId,
            res["result"].id,
            crawlerService
          )
        }),
        // list of input paramters from link extraction response
        map((res: any) => {

          return res["capturedLists"].linklist.map((event) => {
            const inputParameter: InputParameter = {
              originUrl: event.link,
            };
            return inputParameter;
          });
        }),
        // run a bulk task of the second robot with the links as input parameters
        mergeMap((inputParameters: InputParameter[]) => {
          return crawlerService.runBulkTaskOfRobot(
            crawler.secondRobotId,
            inputParameters
          ); 
        }),
        // wait until robot is finished
        mergeMap((res: any) => {
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
          events = events["robotTasks"].items.map((item) => {
            return {...item.capturedTexts, link: item.inputParameters.originUrl, crawlerName};
          });
          sessionStorage.setItem(url, JSON.stringify(events));
          return events;
        })
      )
  );
      }
}
// Custom function to wait until the robot is finished
function waitForRobotToFinish(
  taskOrBulk: "task" | "bulk",
  robotId: string,
  taskId: string,
  crawlerService
) {
  if (taskOrBulk === "task") {
    return crawlerService.getResultOfRobotList(robotId, taskId).pipe(
      map(res => {
        console.log(res)
          if (res["status"] === "failed") {
              throw new Error("Task failed");
          }
         return res}),
      repeat({ delay: 5000 }),
      first((res: any) => {
        return res["status"] === "successful"}),
        catchError(error => {
        // Handle the error or rethrow it to be caught by subscribers
        return throwError(error);
      })
    ); 
  } else if (taskOrBulk === "bulk") {
    return crawlerService.getBulkResultOfRobot(robotId, taskId).pipe(
      map((res) => {
        if (res["robotTasks"].items.some(task => task["status"] === "failed")) {
             throw new Error("Bulk task failed");
        }
        console.log("Waiting for robot to complete the task ");
        return res;
      }),
      repeat({ delay: 5000 }),
      first((res: any) => {
        let allTasksFinished = true;
        res["robotTasks"].items.forEach((task) => {
          console.log(task)
          task["status"] !== "successful" ? (allTasksFinished = false) : null;
        });
        return allTasksFinished;
      }),
      catchError(error => {
        // Handle the error or rethrow it to be caught by subscribers
        return throwError(error);
      })
  );
  }
}
