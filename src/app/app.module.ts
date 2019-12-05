import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MaterialModule } from './material.module';
import { map, catchError } from 'rxjs/operators';
import { of, ObservableInput } from 'rxjs';

import { JwtComponent } from './components/jwt/jwt.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from '@page/dashboard/dashboard.component';
import { ArchiveComponent } from '@page/archive/archive.component';
import { ApiComponent } from '@page/api/api.component';
import { NotFoundComponent } from '@page/not-found/not-found.component';
import { SystemSettingsModule } from '@page/system-settings/system-settings.module';

import { UploadFileComponent } from '@component/upload-file/content-upload/simple-content-upload/upload-file.component';
import { DragAndDropContentUploadComponent } from '@component/upload-file/content-upload/drag-and-drop/drag-and-drop.component';
import { ConfirmDialogComponent } from '@component/confirm-dialog/confirm-dialog.component';
import { ContentUploadDialogComponent } from '@component/upload-file/content-upload/content-upload-dialog.component';
import { DocumentUploadDialogComponent } from '@component/upload-file/document-upload-dialog.component';
import { SidebarComponent } from '@component/sidebar/sidebar-title/sidebar.component';
import { SidebarIconsComponent } from '@component/sidebar/sidebar-icons/sidebar-icons.component';
import { SearchComponent } from '@component/search/search.component';
import { DocumentUploadComponent } from '@component/upload-file/document-upload/document-upload.component';

import { DocumentService } from '@service/document/document.service';
import { RequestService } from '@service/request/request.service';
import { AuthenticationService } from '@service/authentication/auth.service';
import { ConfigurationService, Configuration } from '@service/configuration/configuration.service'
import { PageControlService } from '@service/menu/pages/page-control.service';
import { I18NSnapInRegistry, I18nSnapIn } from '@service/i18n/i18n.service';

export function HttpLoaderFactory(http: HttpClient, registry: I18NSnapInRegistry) {
  return registry.loaderFactory();
}

function load(http: HttpClient, configurationService: ConfigurationService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get('./web/configuration.json')
        .pipe(
          map((config: Configuration) => {
            configurationService.setConfig(config);
            console.log("Configuration loaded:");
            console.log(config);
            resolve(true);
          }),
          catchError((x: { status: number }): ObservableInput<{}> => {
            console.error(`Error while Loading configuration file! [status:${x.status}] : [/web/configuration.json]`);
            resolve(false);
            return of({});
          })
        ).subscribe();
    });
  };
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
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: I18nSnapIn, useValue: {
        i18nPrefix: './assets/i18n/',
      },
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        HttpClient,
        ConfigurationService
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
