import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {EventsComponent} from './pages/events/events.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
},{
  path: 'login',
  component: LoginComponent,
  data: {
    title: 'Sign Up | Timining'
  }
},{
  path: 'events',
  component: EventsComponent,
  data: {
    title: 'Events | Timining'
  }
},  { path: '**', component: LoginComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
