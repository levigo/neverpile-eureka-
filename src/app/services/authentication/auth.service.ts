import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthConfig } from '@classe/auth-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const cookieKey = 'auth-access-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public accessToken = '';
  private authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private response: string;
  private errorResponse: string;

  constructor(
    private authConfig: AuthConfig,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // recover token from cookie (for now)
    const tokenCookie = cookieService.get(cookieKey);
    if (tokenCookie) {
      this.accessToken = tokenCookie;
    }

    // TODO
    this.developmentMethod();
  }

  private developmentMethod(): void {
    this.getAccessToken();
  }

  public authenticationStateChanged(): Observable<boolean> {
    return this.authSubject;
  }

  public isAuthenticated(): boolean {
    throw new Error('Method not implemented.');
  }

  public showLoginForm(): void {
    throw new Error('Method not implemented.');
  }

  public login(): void {
    this.getAccessToken();
  }

  public logout(): void {
    this.accessToken = '';
    this.authSubject.next(false);
  }

  private updateAuthToken(newToken: string): void {
    throw new Error('Method not implemented.');
  }

  public hasRole(role: string): boolean {
    throw new Error('Method not implemented.');
  }

  public authenticate(user: string, pwd: string, callback: (succeeded: boolean) => void) {
    throw new Error('Method not implemented.');
  }

  private getAccessToken() {
    const requestBody = 'grant_type=password&username=' + this.authConfig.username + '&password=' +
      this.authConfig.password + '&client_id=' + this.authConfig.client;
    const auth = 'Basic ' + window.btoa(this.authConfig.client + ':' + this.authConfig.secret);

    this.sendAuthRequest(auth, requestBody).subscribe(result => {
      this.accessToken = result.access_token;
      this.authSubject.next(true);
      this.response = JSON.stringify(result, null, 4);
      this.errorResponse = '';

      this.cookieService.set(cookieKey, this.accessToken);
    }, error => {
      this.response = '';
      this.errorResponse = JSON.stringify(error, null, 4);
    });
  }


  private sendAuthRequest(auth: string, requestBody: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
      }),
      responseType: 'json' as 'text'
    };
    return this.http.post(this.authConfig.auth_url, requestBody, httpOptions);
  }
}
