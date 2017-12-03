import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SuiModule, SuiPopupModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './dashboard/room-list/room-list.component';
import { MeetService } from './services/meet.service';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { AccountService } from './services/account.service';
import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';
import { SignupComponent } from './login/signup/signup.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './auth-guard/auth.guard';
import { CommonModule } from '@angular/common';
import { RoomListFilterPipe } from './dashboard/room-list-filter.pipe';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { TimeSelectComponent } from './room-detail/time-select/time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import { FreetimeService } from './services/freetime.service';
import { IsLoggedIn } from './is-logged-in/is-logged-in';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { PlaceComponent } from './create-room/place/place.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GoogleCalendarComponent } from './google-calendar/google-calendar.component';
import { GoogleApiModule, NG_GAPI_CONFIG, NgGapiClientConfig } from 'ng-gapi';
import { ScheduleService } from './services/schedule.service';

const routes: Routes = [
  { path : '', redirectTo : 'login', pathMatch : 'full' },
  { path : 'dashboard', component : DashboardComponent, canActivate : [ AuthGuard ] },
  { path : 'room/create', component : CreateRoomComponent, canActivate : [ AuthGuard ] },
  { path : 'room/:hash', component : RoomDetailComponent, canActivate : [ AuthGuard ] },
  { path : 'link/:hash', redirectTo : 'room/:hash', pathMatch : 'full' },
  { path : 'login', component : LoginComponent, resolve: [ IsLoggedIn ] },
  { path : 'signup', component : SignupComponent },
  { path : 'room/:hash/time', component : TimeSelectComponent, canActivate : [ AuthGuard ] },
  { path : 'room/:hash/place', component : PlaceComponent, canActivate : [ AuthGuard ] },
  { path : 'profile', component : ProfileComponent, canActivate : [ AuthGuard ] },
  { path : 'not_found', component : NotFoundComponent },
  { path : '**', redirectTo : '/not_found'}
];

/* For Google Calendar API */
const gapiClientConfig: NgGapiClientConfig = {
  client_id: '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly'
  ].join(' ')
};

export function MyCookieStrategy() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}

@NgModule({
  declarations : [AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    RoomListComponent,
    CreateRoomComponent,
    RoomDetailComponent,
    RoomListFilterPipe,
    TimeSelectComponent,
    ProfileComponent,
    PlaceComponent,
    NotFoundComponent,
    GoogleCalendarComponent
  ],
  imports : [
    CommonModule,
    BrowserModule,

    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    SuiModule,
    ClipboardModule,
    CalendarModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDBe3QLe8Z3c8Kpuw88gMHpfrgvHseQOXc',
      libraries: ['places']
    }),
    SuiPopupModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig,
    }),
  ],
  providers : [
    AccountService,
    MeetService,
    AuthenticationService,
    FreetimeService,
    ScheduleService,
    AuthGuard,
    IsLoggedIn,
    {
      provide : XSRFStrategy,
      useFactory : MyCookieStrategy
    }
  ],
  bootstrap : [ AppComponent ]
})

export class AppModule {
}
