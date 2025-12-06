import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient){}

  BASE_URL: String = 'http://localhost:8080';
  getLogin(postJson: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, postJson);
  }
  getSignup(postJson: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/register`, postJson);
  }
}
