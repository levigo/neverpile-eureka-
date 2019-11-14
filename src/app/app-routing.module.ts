import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '@page/dashboard/dashboard.component';
import { SystemSettingsComponent } from '@page/system-settings/system-settings.component';
import { ArchiveComponent } from '@page/archive/archive.component';
import { ApiComponent } from '@page/api/api.component';
import { NotFoundComponent } from '@page/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'archive',
    component: ArchiveComponent
  },
  {
    path: 'api',
    component: ApiComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, /*{ enableTracing: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
