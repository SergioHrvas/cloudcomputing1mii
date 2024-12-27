import { Routes } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/users/register/register.component';
import { UserEditComponent } from './components/users/edit-profile/user-edit.component';
import { AuthGuard } from './guards/auth.guard';

import { ZonesComponent } from './components/zones/list/zone-list.component';
import { ZoneComponent } from './components/zones/zone/zone.component';
import { NewZoneComponent } from './components/zones/new-zone/new-zone.component';
import { EditZoneComponent } from './components/zones/edit-zone/edit-zone.component';

import { SpeciesComponent } from './components/species/list/specie-list.component';
import { SpecieComponent } from './components/species/specie/specie.component';
import { NewSpecieComponent } from './components/species/new-specie/new-specie.component';
import { EditSpecieComponent } from './components/species/edit-specie/edit-specie.component';

import { InhabitantsComponent } from './components/inhabitants/list/inhabitant-list.component';
import { InhabitantComponent } from './components/inhabitants/inhabitant/inhabitant.component';
import { NewInhabitantComponent } from './components/inhabitants/new-inhabitant/new-inhabitant.component';
import { EditInhabitantComponent } from './components/inhabitants/edit-inhabitant/edit-inhabitant.component';
import { UsersComponent } from './components/users/list/user-list.component';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { UserComponent } from './components/users/user/user.component';
import { TasksComponent } from './components/tasks/list/task-list.component';
import { NewTaskComponent } from './components/tasks/new-task/new-task.component';
import { TaskComponent } from './components/tasks/task/task.component';
import { EditTaskComponent } from './components/tasks/edit-task/edit-task.component';
import { UnauthorizedComponent } from './components/misc/unauthorized.component';
import { AuthAdminGuard } from './guards/authAdmin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'unauthorized', component: UnauthorizedComponent},

    { path: 'edit-profile', component: UserEditComponent, canActivate: [AuthGuard]},
    { path: 'users', component: UsersComponent, canActivate: [AuthAdminGuard]},
    { path: 'create-user', component: NewUserComponent, canActivate: [AuthAdminGuard]},
    { path: 'user/:id', component: UserComponent, canActivate: [AuthAdminGuard]},
    
    { path: 'zones', component: ZonesComponent, canActivate: [AuthGuard]},
    { path: 'zone/:id', component: ZoneComponent, canActivate: [AuthGuard]},
    { path: 'create-zone', component: NewZoneComponent, canActivate: [AuthAdminGuard]},
    { path: 'edit-zone/:id', component: EditZoneComponent, canActivate: [AuthAdminGuard]},

    { path: 'species', component: SpeciesComponent, canActivate: [AuthAdminGuard]},
    { path: 'specie/:id', component: SpecieComponent, canActivate: [AuthAdminGuard]},
    { path: 'create-specie', component: NewSpecieComponent, canActivate: [AuthAdminGuard]},
    { path: 'edit-specie/:id', component: EditSpecieComponent, canActivate: [AuthAdminGuard]},
    
    { path: 'inhabitants', component: InhabitantsComponent, canActivate: [AuthGuard]},
    { path: 'inhabitant/:id', component: InhabitantComponent, canActivate: [AuthGuard]},
    { path: 'create-inhabitant', component: NewInhabitantComponent, canActivate: [AuthAdminGuard]},
    { path: 'edit-inhabitant/:id', component: EditInhabitantComponent, canActivate: [AuthAdminGuard]},

    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard]},
    { path: 'create-task', component: NewTaskComponent, canActivate: [AuthGuard]},
    { path: 'task/:id', component: TaskComponent, canActivate: [AuthGuard]},
    { path: 'edit-task/:id', component: EditTaskComponent, canActivate: [AuthGuard]},

];
