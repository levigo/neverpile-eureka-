import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragAndDropContentUploadComponent } from '@component/upload-file/content-upload/drag-and-drop/drag-and-drop.component';
import { DashboardComponent } from '@page/dashboard/dashboard.component';
import { UploadFileComponent } from '@component/upload-file/content-upload/simple-content-upload/upload-file.component';
import { ArchiveComponent } from '@page/archive/archive.component';
import { ApiComponent } from '@page/api/api.component';

import { ConfirmDialogComponent } from '@component/confirm-dialog/confirm-dialog.component';
import { ContentUploadDialogComponent } from '@component/upload-file/content-upload/content-upload-dialog.component';
import { DocumentUploadDialogComponent } from '@component/upload-file/document-upload-dialog.component';

import { DocumentService } from '@service/document/document.service';
import { RequestService } from '@service/request/request.service';
import { SidebarComponent } from '@component/sidebar/sidebar-title/sidebar.component';
import { MaterialModule } from './material.module';
import { AuthenticationService } from '@service/authentication/auth.service';
import { NotFoundComponent } from '@page/not-found/not-found.component';
import { SidebarIconsComponent } from '@component/sidebar/sidebar-icons/sidebar-icons.component';
import { PageControlService } from '@service/menu/pages/page-control.service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { SearchComponent } from '@component/search/search.component';
import { DocumentUploadComponent } from '@component/upload-file/document-upload/document-upload.component';
import { ConfigurationService } from '@service/configuration/configuration.service'

import { SystemSettingsModule } from '@page/system-settings/system-settings.module';
import { CookieService } from 'ngx-cookie-service';
import { I18NSnapInRegistry, I18nSnapIn } from '@service/i18n/i18n.service';
import { JwtComponent } from './components/jwt/jwt.component';

export function HttpLoaderFactory(http: HttpClient, registry: I18NSnapInRegistry) {
  return registry.loaderFactory();
}

@NgModule({
  declarations: [
    ArchiveComponent,
    ApiComponent,
    AppComponent,
    DashboardComponent,
    DocumentUploadDialogComponent,
    DragAndDropContentUploadComponent,
    NotFoundComponent,
    ContentUploadDialogComponent,
    SidebarComponent,
    SidebarIconsComponent,
    UploadFileComponent,
    SearchComponent,
    DocumentUploadComponent,
    ConfirmDialogComponent,
    JwtComponent,
  ],
  imports: [
    SystemSettingsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    NgxFileDropModule,
    NgJsonEditorModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, I18NSnapInRegistry]
      }
    }),
    // routing goes last so that routes in other modules take precedence
    AppRoutingModule,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    DocumentUploadDialogComponent,
    ContentUploadDialogComponent,
  ],
  providers: [
    AuthenticationService,
    DocumentService,
    PageControlService,
    RequestService,
    ConfigurationService,
    SidebarComponent,
    SidebarIconsComponent,
    CookieService,
    I18NSnapInRegistry,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: I18nSnapIn, useValue: {
      i18nPrefix: './assets/i18n/',
    }, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
