import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent} from './event/event.component';
import { StalkerComponent } from './stalker/stalker.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './User/User.component';
import { LoginComponent } from './User/login/login.component';
import { RegistrationComponent } from './User/registration/registration.component';

const routes: Routes = [
  // rotas filhos
  {path: 'user', component: UserComponent,
  children: [
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent}
  ]},

  {path: 'event', component: EventComponent},
  {path: 'stalker', component: StalkerComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
