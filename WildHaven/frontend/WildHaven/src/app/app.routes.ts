import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserEditComponent } from './components/edit-profile/user-edit.component';
import { AuthGuard } from './guards/auth.guard';

import { ZonesComponent } from './components/zones/list/zone-list.component';
import { ZoneComponent } from './components/zones/zone/zone.component';
import { NewZoneComponent } from './components/zones/new-zone/new-zone.component';
import { EditZoneComponent } from './components/zones/edit-zone/edit-zone.component';

import { SpeciesComponent } from './components/species/list/specie-list.component';
import { SpecieComponent } from './components/species/specie/specie.component';
import { NewSpecieComponent } from './components/species/new-specie/new-specie.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, },
    { path: 'edit-profile', component: UserEditComponent, canActivate: [AuthGuard]},

    { path: 'zones', component: ZonesComponent, canActivate: [AuthGuard]},
    { path: 'zone/:id', component: ZoneComponent, canActivate: [AuthGuard]},
    { path: 'create-zone', component: NewZoneComponent, canActivate: [AuthGuard]},
    { path: 'edit-zone/:id', component: EditZoneComponent, canActivate: [AuthGuard]},

    { path: 'species', component: SpeciesComponent, canActivate: [AuthGuard]},
    { path: 'specie/:id', component: SpecieComponent, canActivate: [AuthGuard]},
    { path: 'create-specie', component: NewSpecieComponent, canActivate: [AuthGuard]}

];
