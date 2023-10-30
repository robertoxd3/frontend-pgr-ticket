import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string;
  private httpClient = inject(HttpClient);
  id!: number;
  enlace: string = '';

  constructor() {
    this.baseUrl = environment.loginUrl;
  }

  authenticate(form: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl, form);
  }
}
