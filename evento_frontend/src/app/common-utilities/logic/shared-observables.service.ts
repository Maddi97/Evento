import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

type ScrollingDirection = "up" | "down";
type ScrollOutIn = {
  direction: ScrollingDirection;
  distanceTop: number;
  distanceBottom: number;
};

@Injectable({
  providedIn: "root",
})
export class SharedObservableService {
  private numberOfScrolls = 0;
  private actualScrollDirection: ScrollingDirection = undefined;
  private scrollSubject = new Subject<ScrollingDirection>();
  private scrollOutInSubscject = new Subject<Boolean>();
  public scrollObservable = this.scrollSubject.asObservable();
  public scrollOutInOfScreenObservable =
    this.scrollOutInSubscject.asObservable();

  public notifyScrolling(scrollingDirection: ScrollingDirection): void {
    this.scrollSubject.next(scrollingDirection);
  }

  public notifyScrollOutInOfScreen(scrollOutIn: ScrollOutIn): void {
    if (scrollOutIn.distanceTop < 30 || scrollOutIn.distanceBottom < 1) {
      this.scrollOutInSubscject.next(false);
    } else if (this.numberOfScrolls > 50) {
      this.scrollOutInSubscject.next(scrollOutIn.direction === "down");
      this.numberOfScrolls = 0;
    }
    this.numberOfScrolls++;
  }
}
