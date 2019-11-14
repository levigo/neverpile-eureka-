import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { SystemSettingsComponent, SystemSettingsSnapIn } from '@page/system-settings/system-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AccessPolicyModule } from '@page/system-settings/access-policy/access-policy.module';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { IndexMaintenanceComponent } from './index-maintenance/index-maintenance.component';
import { AgmCoreModule } from '@agm/core';
import { SupportComponent } from './support/support.component';
import { GooglemapComponent } from './support/map/googlemap/googlemap.component';
import { I18nSnapIn } from '@service/i18n/i18n.service';

const systemSettingsRoutes: Routes = [
  { path: 'system-settings', component: SystemSettingsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule,
    AccessPolicyModule,
    AgmCoreModule.forRoot({
      apiKey: ''// TODO: API KEY
    }),
    // router goes last
    RouterModule.forChild(systemSettingsRoutes),
  ],
  declarations: [
    SystemSettingsComponent,
    PlaceholderComponent,
    IndexMaintenanceComponent,
    SupportComponent,
    GooglemapComponent,
  ],
  exports: [
    RouterModule,
  ],
  entryComponents: [
    PlaceholderComponent,
    IndexMaintenanceComponent,
    SupportComponent
  ],
  providers: [
    { provide: SystemSettingsSnapIn, useValue: {
      name: 'heading-import',
      componentType: PlaceholderComponent,
    }, multi: true },
    { provide: SystemSettingsSnapIn, useValue: {
      name: 'heading-export',
      componentType: PlaceholderComponent,
    }, multi: true },
    { provide: SystemSettingsSnapIn, useValue: {
      name: 'heading-index-maintenance',
      componentType: IndexMaintenanceComponent,
    }, multi: true },
    { provide: SystemSettingsSnapIn, useValue: {
      name: 'heading-support',
      componentType: SupportComponent,
      priority: -1,
    }, multi: true },
    { provide: I18nSnapIn, useValue: {
      i18nPrefix: './assets/plugins/system-settings/i18n/',
    }, multi: true },
  ]
})
export class SystemSettingsModule { }
