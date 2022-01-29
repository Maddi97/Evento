import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EventViewComponent} from './pages/event/event-view/event-view.component';
import {AppComponent} from './app.component';
import {OrganizerViewComponent} from './pages/organizer/organizer-view/organizer-view.component';
import {CategoryViewComponent} from './pages/category/category-view/category-view.component';

const routes: Routes = [
    {path: 'event', component: EventViewComponent},
    {path: 'organizer', component: OrganizerViewComponent},
    {path: 'category', component: CategoryViewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
