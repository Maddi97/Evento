import { of } from "rxjs";
import { first, map, mergeMap, repeat } from "rxjs/operators";
import { InputParameter } from "../../../services/crawler/crawler-api.service";

export function crawlBrowseAi(crawler, url, crawlerService) {
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
            return item.capturedTexts;
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
      map(res => {console.log(res); return res}),
      repeat({ delay: 5000 }),
      first((res: any) => res["status"] === "successful"),
    );
  } else if (taskOrBulk === "bulk") {
    return crawlerService.getBulkResultOfRobot(robotId, taskId).pipe(
      map((res) => {
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
    );
  }
}
