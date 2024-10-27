import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserEditComponent } from './components/edit-profile/user-edit.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, },
    {path: 'edit-profile', component: UserEditComponent, canActivate: [AuthGuard]}

];
