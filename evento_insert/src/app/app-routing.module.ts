import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CategoryViewComponent } from "./pages/category/category-view/category-view.component";
import { CrawlEventsComponent } from "./pages/crawl-events/crawl-events.component";
import { EventViewComponent } from "./pages/event/event-view/event-view.component";
import { OrganizerViewComponent } from "./pages/organizer/organizer-view/organizer-view.component";
import { AuthGuardService } from "./services/auth/auth.guard.service";

const routes: Routes = [
  {
    path: "event",
    component: EventViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "organizer",
    component: OrganizerViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "category",
    component: CategoryViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "crawler",
    component: CrawlEventsComponent,
    canActivate: [AuthGuardService],
  },
  { path: "login", component: LoginComponent },
  { path: "**", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
