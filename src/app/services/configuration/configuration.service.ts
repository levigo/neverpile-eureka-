import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface Configuration {
  neverpileUrl?: string,
  springBootAdminUrl?: string,
  jwtUrl?: string,
  authUsername?: string,
  authPassword?: string,
  authClientName?: string,
  authSecret?: string
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: Configuration;

  constructor() {  }

  setConfig(newConfig: Configuration) {
    this.config = newConfig;
  }

  isProduction(): boolean {
    return environment.production ? environment.production : true;
  }

  getNeverpileUrl(): string {
    return this.config && this.config.neverpileUrl ? this.config.neverpileUrl : "http://127.0.0.1:8080";
  }

  getSpringBootAdminUrl(): string {
    return this.config && this.config.springBootAdminUrl ? this.config.springBootAdminUrl : "http://127.0.0.1:1001";
  }

  getJwtUrl(): string {
    return this.config && this.config.jwtUrl ? this.config.jwtUrl : "http://127.0.0.1:8888";
  }

  getAuthUsername(): string {
    return this.config && this.config.authUsername ? this.config.authUsername : 'admin';
  }

  getAuthPassword(): string {
    return this.config && this.config.authPassword ? this.config.authPassword : 'admin';
  }

  getAuthClientName(): string {
    return this.config && this.config.authClientName ? this.config.authClientName : 'trusted-app';
  }

  getAuthSecret(): string {
    return this.config && this.config.authSecret ? this.config.authSecret : 'secret';
  }

  public getAuthUrl(): string {
    return this.getNeverpileUrl() + '/oauth/token';
  }
}
