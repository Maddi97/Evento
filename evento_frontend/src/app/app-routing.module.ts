import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "categories",
    loadComponent: () =>
      import("./pages/categories/categories.component").then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./pages/settings/settings.component").then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: "full-event/:eventId",
    loadComponent: () =>
      import("./pages/full-event/full-event.component").then(
        (m) => m.FullEventComponent
      ),
  },
  {
    path: "",
    loadComponent: () =>
      import("./pages/events/events.component").then((m) => m.EventsComponent),
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
