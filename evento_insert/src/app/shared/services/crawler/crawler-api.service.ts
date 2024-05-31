import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, of, share, throwError } from "rxjs";
import { WebService } from "../web/web.service";

export type InputParameter = {
  originUrl: string;
};
@Injectable({
  providedIn: "root",
})
export class CrawlerApiService {
  constructor(private webService: WebService) {}

  getRobots() {
    return this.webService.get("robots/").pipe(
      map((r: HttpRequest<any>) => r as unknown),
      share()
    );
  }

  runTaskOfRobot(robotId, originUrl) {
    const body = {
      robotId: robotId,
      originUrl: originUrl,
    };
    return this.webService.post("runTaskOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }

  runBulkTaskOfRobot(robotId, inputParameters: InputParameter[]) {
    const body = {
      robotId: robotId,
      inputParameters: inputParameters,
    };
    if (inputParameters[0].originUrl.includes("7")) {
      throw new Error("i throw a error on date");
    }

    return this.webService.post("runBulkTaskOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
  getResultOfRobotList(robotId: string, taskId: string) {
    const body = {
      robotId: robotId,
      taskId: taskId,
    };
    return this.webService.post("getTaskResultsOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
  getResultOfRoboSingleScrape(robotId, taskId) {
    const body = {
      robotId: robotId,
      taskId: taskId,
    };
    return this.webService.post("getTaskResultsOfRobot/", body).pipe(
      map((response) => {
        return response["capturedTexts"];
      }),
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
  getTasksOfRobot(robotId) {
    const body = {
      robotId: robotId,
    };
    return this.webService.post("getTasksOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      map((r) => r[Object.keys(r)[0]]),
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
  getBulkRunsOfRobot(robotId) {
    const body = {
      robotId: robotId,
    };
    return this.webService.post("getBulkRunsOfRobot/", body).pipe(
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
  getBulkResultOfRobot(robotId, taskId, pageNumber) {
    const body = {
      robotId: robotId,
      taskId: taskId,
      page: pageNumber,
    };

    return this.webService.post("getBulkTaskOfRobot/", body).pipe(
      map((response) => {
        if (response["name"] === "Error") {
          throw new Error(
            `Error response from API: ${response["message"]}`,
            response
          );
        }
        return response;
      }),
      share()
    );
  }
}
