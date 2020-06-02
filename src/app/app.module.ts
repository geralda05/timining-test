import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { EventsComponent } from './pages/events/events.component';
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from './components/navbar/navbar.component';

const config: SocketIoConfig = { url: 'wss://frontend-excercise.dt.timlabtesting.com/eventstream/connect', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EventsComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularHighchartsChartModule,
    FontAwesomeModule,
    SocketIoModule.forRoot(config),
    NgxPaginationModule
  ],
  providers: [], 
  bootstrap: [AppComponent]
})

export class AppModule { }
