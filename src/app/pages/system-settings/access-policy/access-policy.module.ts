import { NgModule, Directive, HostListener } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSettingsSnapIn } from '@page/system-settings/system-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccessPolicyComponent } from '@page/system-settings/access-policy/access-policy.component';
import { AccessPolicyEditorComponent, ConfirmIgnoreValidationFailuresDialog } from './access-policy-editor/access-policy-editor.component';
import { RuleEditorComponent, StringListEditorComponent } from './access-policy-editor/rule-editor.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { I18nSnapIn } from '@service/i18n/i18n.service';

const accessPolicyRoutes: Routes = [
  { path: 'system-settings/access-policy', component: AccessPolicyComponent },
  { path: 'system-settings/access-policy/:id/edit', component: AccessPolicyEditorComponent },
  { path: 'system-settings/access-policy/:id/clone', component: AccessPolicyEditorComponent },
];

@Directive({
  selector: '[appNoClickPropagation]'
})
export class NoClickPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule,
    NgJsonEditorModule,
    RouterModule.forChild(accessPolicyRoutes),
  ],
  declarations: [
    AccessPolicyComponent,
    AccessPolicyEditorComponent, ConfirmIgnoreValidationFailuresDialog,
    RuleEditorComponent,
    StringListEditorComponent,
    NoClickPropagationDirective,
  ],
  entryComponents: [
    ConfirmIgnoreValidationFailuresDialog,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    { provide: SystemSettingsSnapIn, useValue: {
      name: 'heading-access-policies',
      componentType: AccessPolicyComponent,
    }, multi: true },
    { provide: I18nSnapIn, useValue: {
      i18nPrefix: './assets/plugins/access-policy/i18n/',
    }, multi: true },
  ]
})
export class AccessPolicyModule  {

}
