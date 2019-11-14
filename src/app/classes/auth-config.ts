import { environment } from '@environments/environment';

export class AuthConfig {

  public username = 'admin';
  public password = 'admin';
  public  client = 'trusted-app';
  public secret = 'secret';

  public auth_url: string = environment.neverpileUrl + '/oauth/token';
}
