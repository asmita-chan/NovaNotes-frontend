import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient){}

  BASE_URL: String = environment.BASE_URL;
  getLogin(postJson: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, postJson);
  }
  getSignup(postJson: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/register`, postJson);
  }
}
