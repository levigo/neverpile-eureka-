import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@service/authentication/auth.service';

type ResponseType =  'arraybuffer' | 'blob' | 'json' | 'text' ;

export interface DocumentDto {
  documentId: string,
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  request(path: string, contentType: string = 'application/json', responseType: ResponseType = 'json', auth: string = 'Bearer ' + this.authService.accessToken) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Authorization': auth
      }),
      responseType: responseType as 'json',
      params: new HttpParams()
    };

    const http = this.http;
    return {
      withParam(name: string, value: string) {
        httpOptions.params = httpOptions.params.set(name, value); return this;
      },

      get<T>() : Observable<T> { return http.get<T>(path, httpOptions); },
      head<T>() : Observable<T>{ return http.head<T>(path, httpOptions); },
      options<T>() : Observable<T> { return http.options<T>(path, httpOptions); },
      patch<T>(requestBody: any) : Observable<T> { return http.patch<T>(path, requestBody, httpOptions); },
      post<T>(requestBody: any) : Observable<T> { return http.post<T>(path, requestBody, httpOptions); },
      put<T>(requestBody: any) : Observable<T> { return http.put<T>(path, requestBody, httpOptions); },
      delete<T>() : Observable<T> { return http.delete<T>(path, httpOptions); }
    };
  }

  public uploadContent(url: string, files: File[]): Observable<any> {
    let formData: FormData = new FormData();

    formData = this.appendFiles(files, formData);

    const req = new HttpRequest('POST', url, formData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    });
    return this.http.request(req);
  }

  uploadDocument(url: string, documentDto: DocumentDto, files: File[]): any {
    let formData: FormData = new FormData();

    formData.append('__DOC', new Blob([JSON.stringify(documentDto)], { type: 'application/json' }));

    formData = this.appendFiles(files, formData);

    const req = new HttpRequest('POST', url, formData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    });
    return this.http.request(req);
  }

  private appendFiles(files: File[], formData: FormData): FormData {
    for (let index = 0; index < files.length; index++) {
      const file: File = files[index];
      formData.append('__PART', file, file.name);
    }
    return formData;
  }
}
