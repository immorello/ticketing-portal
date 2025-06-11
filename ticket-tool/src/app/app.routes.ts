import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { loginGuardGuard } from './login-guard.guard';
import { NewPasswordComponent } from './login-page/new-password/new-password.component';
import { DashboardComponent } from './home-page/dashboard/dashboard.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'login/new-password', component: NewPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[loginGuardGuard]},
  { path: 'groups', component:GroupsPageComponent, canActivate:[loginGuardGuard]}
];
