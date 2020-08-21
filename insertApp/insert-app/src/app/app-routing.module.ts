import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventViewComponent } from './pages/event-view/event-view.component';
import { AppComponent } from './app.component';
import { OrganizerViewComponent } from './pages/organizer-view/organizer-view.component';

const routes: Routes = [
  { path: 'event', component: EventViewComponent },
  { path: 'organizer', component: OrganizerViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
