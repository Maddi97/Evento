import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type ScrollingDirection = "up" | "down";

@Injectable({
  providedIn: 'root'
})
export class SharedObservableService {
  private scrollSubject = new Subject<ScrollingDirection>();
  public scrollObservable = this.scrollSubject.asObservable();

  public notifyScrolling(scrollingDirection: ScrollingDirection): void {
    this.scrollSubject.next(scrollingDirection);
  }}
