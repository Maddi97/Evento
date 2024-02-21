import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, share, throwError } from "rxjs";
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
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
      }),
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
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  runBulkTaskOfRobot(robotId, inputParameters: InputParameter[]) {
    const body = {
      robotId: robotId,
      inputParameters: inputParameters,
    };
    return this.webService.post("runBulkTaskOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
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
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
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
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
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
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
  getBulkRunsOfRobot(robotId) {
    const body = {
      robotId: robotId,
    };
    return this.webService.post("getBulkRunsOfRobot/", body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
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
        console.log("bulk run result: ", response);
        return response;
      }),
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
}
