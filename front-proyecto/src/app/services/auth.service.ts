import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(this.api + '/login', data, { responseType: 'text' });
  }

  registro(data: any) {
    return this.http.post(this.api + '/registro', data, { responseType: 'text' });
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }
}