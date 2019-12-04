import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import config from '../../../../configuration.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor() {
      console.log("configuration loaded:")
      console.log(config);
   }

  isProduction(): boolean{
    return environment.isProduction ? environment.isProduction : true;
  }
  
  getNeverpileUrl(): string{
    return config && config.neverpileUrl ? config.neverpileUrl : "http://127.0.0.1:8080";
  }

  getSpringBootAdminUrl(): string{
    return config && config.springBootAdminUrl ? config.springBootAdminUrl : "http://127.0.0.1:1001";
  }

  getJwtUrl(): string{
    return config && config.jwtUrl ? config.jwtUrl : "http://127.0.0.1:8888";
  }

  getAuthUsername(): string{
    return config && config.authUsername ? config.authUsername : 'admin';
  }

  getAuthPassword(): string{
    return config && config.authPassword ? config.authPassword : 'admin';
  }

  getAuthClientName(): string{
    return config && config.authClientName ? config.authClientName : 'trusted-app';
  }

  getAuthSecret(): string{
    return config && config.authSecret ? config.authSecret : 'secret';
  }

  public getAuthUrl(): string {
    return this.getNeverpileUrl() + '/oauth/token';
  }
}
