import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { CategoryViewComponent } from "./pages/category-view/category-view.component";
import { CrawlEventsComponent } from "./pages/crawl-events/crawl-events.component";
import { EventViewComponent } from "./pages/event-view/event-view.component";
import { OrganizerViewComponent } from "./pages/organizer-view/organizer-view.component";
import { AuthGuardService } from "@shared/services/auth/auth.guard.service";
import { GlobalSettingsComponent } from "./pages/settings/global-settings/global-settings.component";

const routes: Routes = [
  {
    path: "event",
    loadComponent: () =>
      import("./pages/event-view/event-view.component").then(
        (m) => m.EventViewComponent
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "organizer",
    loadComponent: () =>
      import("./pages/organizer-view/organizer-view.component").then(
        (m) => m.OrganizerViewComponent
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "category",
    loadComponent: () =>
      import("./pages/category-view/category-view.component").then(
        (m) => m.CategoryViewComponent
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "crawler",
    loadComponent: () =>
      import("./pages/crawl-events/crawl-events.component").then(
        (m) => m.CrawlEventsComponent
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./pages/settings/global-settings/global-settings.component").then(
        (m) => m.GlobalSettingsComponent
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  { path: "**", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
