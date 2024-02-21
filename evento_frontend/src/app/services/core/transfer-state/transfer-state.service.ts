import { isPlatformServer } from "@angular/common";
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  StateKey,
  TransferState,
  makeStateKey,
} from "@angular/core";
import { FilterEvents } from "@globals/types/events.types";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TransferStateService {
  isServer = false;
  constructor(
    private tstate: TransferState,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  transferState(
    key: StateKey<any>,
    getDataObservable: Observable<any>,
    defaultValue: any = null
  ) {
    if (this.tstate.hasKey(key)) {
      return of(this.tstate.get(key, defaultValue));
    } else {
      return getDataObservable.pipe(
        tap((data) => {
          if (this.isServer) {
            this.tstate.set(key, data);
          }
        })
      );
    }
  }

  getDynamicStateKey(key: string) {
    return makeStateKey<any>(key);
  }
}
