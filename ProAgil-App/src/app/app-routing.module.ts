import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent} from './event/event.component';
import { StalkerComponent } from './stalker/stalker.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './User/User.component';
import { LoginComponent } from './User/login/login.component';
import { RegistrationComponent } from './User/registration/registration.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  // rotas filhos
  {path: 'user', component: UserComponent,
  children: [
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent}
  ]},

  {path: 'event', component: EventComponent , canActivate:[AuthGuard]},
  {path: 'stalker', component: StalkerComponent, canActivate:[AuthGuard]},
  {path: 'contact', component: ContactComponent, canActivate:[AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
