import { filter, map, mergeMap, repeat, takeWhile } from "rxjs/operators";
import { InputParameter } from "../../../services/crawler/crawler-api.service";

export function crawlUrbanite(crawler, url, crawlerService) {
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
          );
        }),
        //get result of robot

        mergeMap((res: any) => {
          console.log("Task 2 response: ", res["id"]);
          return crawlerService.getResultOfRobotList(
            crawler.robotId,
            res["id"]
          );
        }),
        // list of input paramters from link extraction response
        map((res: any) => {
          return res["capturedLists"].linkList.map((event) => {
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
          return events;
          //return mapUrbaniteToEvents(events);
        })
      )
  );
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
      map((res: any) => {
        return res;
      }),
      repeat({ delay: 5000 }),
      takeWhile((res: any) => res["status"] !== "successful"),
      filter((res: any) => res["status"] === "successful")
    );
  } else if (taskOrBulk === "bulk") {
    return crawlerService.getBulkResultOfRobot(robotId, taskId).pipe(
      map((res) => {
        console.log("Waiting for robot to complete the task ");
        return res;
      }),
      repeat({ delay: 5000 }),
      takeWhile((res: any) => res["status"] !== "successful"),
      filter((res: any) => {
        let allTasksFinished = true;
        res["robotTasks"].items.forEach((task) => {
          task["status"] !== "successful" ? (allTasksFinished = false) : null;
        });
        return allTasksFinished;
      })
    );
  }
}
