import { NgModule } from "@angular/core";
import { FullEventComponent } from "./full-event.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: FullEventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullEventRoutingModule {}
