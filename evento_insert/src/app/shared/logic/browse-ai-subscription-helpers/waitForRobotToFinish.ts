import { CrawlerApiService } from "@shared/services/crawler/crawler-api.service";
import { of, throwError } from "rxjs";
import { catchError, first, map, repeat } from "rxjs/operators";

export function waitForRobotToFinish(
  taskOrBulk: "task" | "bulk",
  robotId: string,
  taskId: string,
  crawlerService: CrawlerApiService,
  url: string,
  pageNumber: string = "1"
) {
  if (taskOrBulk === "task") {
    return crawlerService.getResultOfRobotList(robotId, taskId).pipe(
      map((res: any) => {
        if (res["status"] === "successful" || res["status"] === "failed") {
          //console.count(`Collecting links: ${res["status"]} \nof ${url}`);
        }
        if (res["status"] === "failed") {
          //console.error("A task failed", res);
        }
        return res;
      }),
      repeat({ delay: 3000 }),
      first((res: any) => {
        return res["status"] === "successful" || res["status"] === "failed";
      })
    );
  } else if (taskOrBulk === "bulk") {
    return crawlerService
      .getBulkResultOfRobot(robotId, taskId, pageNumber)
      .pipe(
        map((res) => {
          if (
            res["robotTasks"]?.items &&
            res["robotTasks"].items.some((task) => task["status"] === "failed")
          ) {
            console.error(
              "A Bulk task failed",
              res["robotTasks"].items.filter(
                (task) => task["status"] === "failed"
              )
            );
            //remove all failed tasks from the list
            res["robotTasks"].items = res["robotTasks"].items.filter(
              (task) => task["status"] !== "failed"
            );
          }
          return res;
        }),
        repeat({ delay: 10000 }),
        first((res: any) => {
          let allTasksFinished = true;
          res["robotTasks"]?.items?.forEach((task) => {
            if (task["status"] !== "successful") allTasksFinished = false;
          });
          return allTasksFinished;
        })
      );
  }
}
