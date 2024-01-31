import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FullEventComponent } from "./pages/full-event/full-event.component";

const routes: Routes = [
  {
    path: "categories",
    loadChildren: () =>
      import("./pages/categories/categories.module").then(
        (m) => m.CategoriesModule
      ),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then((m) => m.SettingsModule),
  },
  {
    path: "full-event/:eventId",
    component: FullEventComponent,
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/events/events.module").then((m) => m.EventsModule),
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
