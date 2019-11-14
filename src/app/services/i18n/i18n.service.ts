import { Injectable, Inject } from '@angular/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClient } from '@angular/common/http';

/**
 * A base class for Snap-Ins that provide i18n resource prefixes.
 */
export class I18nSnapIn {
  /** The prefix for i18n resources used by the snap-in. */
  public i18nPrefix: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18NSnapInRegistry {
  constructor(private http: HttpClient, @Inject(I18nSnapIn) private snapIns: I18nSnapIn[]) {}

  loaderFactory() {
    return new MultiTranslateHttpLoader(this.http,
      this.snapIns.filter(s => s.i18nPrefix).map(s => {return {prefix: s.i18nPrefix, suffix: '.json'}})
    );
  }
}

