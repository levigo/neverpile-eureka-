import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface Configuration {
  neverpileUrl?: string,
  springBootAdminUrl?: string,
  jwtUrl?: string,
  authUsername?: string,
  authPassword?: string,
  authClientName?: string,
  authSecret?: string,
  authType?: string
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: Configuration;

  constructor() {  }

  public setConfig(newConfig: Configuration) {
    this.config = newConfig;
  }

  public isProduction(): boolean {
    return environment.production ? environment.production : true;
  }

  public getNeverpileUrl(): string {
    return this.config && this.config.neverpileUrl ? this.config.neverpileUrl : "http://127.0.0.1:8080";
  }

  public getSpringBootAdminUrl(): string {
    return this.config && this.config.springBootAdminUrl ? this.config.springBootAdminUrl : "http://127.0.0.1:1001";
  }

  public getJwtUrl(): string {
    return this.config && this.config.jwtUrl ? this.config.jwtUrl : "http://127.0.0.1:8888";
  }

  public getAuthUsername(): string {
    return this.config && this.config.authUsername ? this.config.authUsername : 'admin';
  }

  public getAuthPassword(): string {
    return this.config && this.config.authPassword ? this.config.authPassword : 'admin';
  }

  public getAuthClientName(): string {
    return this.config && this.config.authClientName ? this.config.authClientName : 'trusted-app';
  }

  public getAuthSecret(): string {
    return this.config && this.config.authSecret ? this.config.authSecret : 'secret';
  }

  public getAuthType(): string {
    return this.config && this.config.authType ? this.config.authType : 'basic';
  }

  public getAuthUrl(): string {
    return this.getNeverpileUrl() + '/oauth/token';
  }
}
