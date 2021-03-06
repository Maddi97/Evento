import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { CategoriesComponent } from './categories/categories.component';
import { SettingsComponent } from './settings/settings.component';
import { FullEventComponent } from './common-utilities/full-event/full-event.component';

const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'full-event',
    component: FullEventComponent
  },
  { path: '**', component: EventsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
