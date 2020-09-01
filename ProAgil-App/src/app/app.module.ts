import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { NavComponent } from './nav/nav.component';
import { ToastrModule } from 'ngx-toastr';
import { DateTimeFormatPipePipe } from './_helpers/DateTimeFormatPipe.pipe';
import { StalkerComponent } from './stalker/stalker.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TitleComponent } from "./_shared/title/title.component";;
import { UserComponent } from './User/User.component';
import { LoginComponent } from './User/login/login.component';
import { RegistrationComponent } from './User/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
      EventComponent,
      NavComponent,
      DateTimeFormatPipePipe,
      StalkerComponent,
      ContactComponent,
      DashboardComponent,
      TitleComponent,
      UserComponent,
      UserComponent,
      RegistrationComponent,
      LoginComponent
   ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
