import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Settings } from "@globals/models/settings";
import * as moment from "moment";
import { Observable, filter, first, map, mergeMap, take, tap } from "rxjs";
import {
  PROMOTION_CATEGORY,
  NOW_CATEGORY,
} from "@globals/constants/categories.c";
@Injectable({
  providedIn: "root",
})
export class CustomRouterService {
  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  getQueryParams(): Observable<any> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._activatedRoute.snapshot.queryParams)
    );
  }
  getQueryParamsEventsComponent(
    settings: Settings,
    categoryList
  ): Observable<any> {
    return this.getQueryParams().pipe(
      map((queryParams) => {
        const date = moment(queryParams.date);
        // append the hours of the current time zone because the post request will automatically
        // change to time with time zone an this could change the date
        date.add(moment(new Date()).utcOffset() / 60, "hours");
        let category = queryParams.category;
        if (category === "1") {
          category = settings.isPromotionActivated
            ? PROMOTION_CATEGORY
            : categoryList[0];
        } else if (category === "2") {
          category = NOW_CATEGORY;
        } else {
          category = category
            ? categoryList.find((c) => c._id === category)
            : categoryList[0];
        }
        let subcategories;
        if (queryParams.subcategory) {
          subcategories = category.subcategories?.filter((s) =>
            queryParams.subcategory.includes(s._id)
          );
        } else {
          subcategories = [];
        }

        return [date, category, subcategories];
      })
    );
  }
}
