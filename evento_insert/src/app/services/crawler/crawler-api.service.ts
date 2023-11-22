import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, share, throwError } from 'rxjs';
import { WebService } from '../web.service';
@Injectable({
  providedIn: 'root'
})
export class CrawlerApiService {

  constructor(private webService: WebService) {
  }

  getRobots() {
    return this.webService.get('robots/').pipe(
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  runTaskOfRobot(robotId, originUrl) {
    const body = {
      robotId: robotId,
      originUrl: originUrl,
    }
    return this.webService.post('runTaskOfRobot/', body).pipe(
      map((r: HttpRequest<any>) => r as unknown),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
  getResultOfRobot(robotId, taskId) {
    const body = {
      robotId: robotId,
      taskId: taskId,
    }
    return this.webService.post('getTaskOfRobot/', body).pipe(
      map(response => response['capturedLists']),
      map((r: HttpRequest<any>) => r as unknown),
      map(r => r[Object.keys(r)[0]]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

}
