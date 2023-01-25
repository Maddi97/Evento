import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EventViewComponent} from './pages/event/event-view/event-view.component';
import {AppComponent} from './app.component';
import {OrganizerViewComponent} from './pages/organizer/organizer-view/organizer-view.component';
import {CategoryViewComponent} from './pages/category/category-view/category-view.component';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services/auth.guard.service';

const routes: Routes = [
    {path: 'event', component: EventViewComponent, canActivate: [AuthGuardService]},
    {path: 'organizer', component: OrganizerViewComponent, canActivate: [AuthGuardService]},
    {path: 'category', component: CategoryViewComponent, canActivate: [AuthGuardService]},
    {path: 'login', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
