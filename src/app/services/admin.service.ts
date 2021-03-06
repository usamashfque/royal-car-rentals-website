import { Injectable } from '@angular/core';
import { Admin } from '../Models/admin.model';
import { HttpClient } from '@angular/common/http';
import { Signin } from '../Models/signin.model';
import { EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  isAdminAuthenticated = new EventEmitter<boolean>();
  readonly baseUrl = environment.apiUrl + "Admin/";
  constructor(private http: HttpClient) { }

  authentication(data: Signin) {
    return this.http.post(this.baseUrl + "authentication", data);
  }
}
