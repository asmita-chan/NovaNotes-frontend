import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {

  constructor(private http:HttpClient){}

  BASE_URL: String = 'http://localhost:8080';
  getAllNotes(postJson: any): Observable<any[]>{
    return this.http.post<any>(`${this.BASE_URL}/getAllNotes`, postJson);
  }
  addNote(postJson: any): Observable<any>{
    return this.http.post<any>(`${this.BASE_URL}/addNote`, postJson);
  }  
  deleteNote(postJson: any): Observable<any>{
    return this.http.post<any>(`${this.BASE_URL}/deleteNote`, postJson);
  }
  updateNote(postJson: any): Observable<any>{
    return this.http.post<any>(`${this.BASE_URL}/updateNote`, postJson);
  }
}
