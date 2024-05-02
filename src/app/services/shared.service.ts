import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  response: Observable<any>;
  baseURL: string = environment.baseURL;
  private messageSource = new BehaviorSubject(localStorage.getItem('title'));
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) {
    //this.baseURL = '/api';
  }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  getToken() {
    return {
      timeout: 100000,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tokenBack')}`,
      },
    };
  }

  //list the menu for the navigate in the system
  getMenuSidebarAdminService(idrol) {
    return this.http.get(`${this.baseURL}/permisos/model/${idrol}`).toPromise();
  }
  getMenuSidebarPermissionRoleService(idrol) {
    return this.http.get(`${this.baseURL}/permisos/user/${idrol}`).toPromise();
  }
  getMenuSidebarAllService() {
    return this.http.get(`${this.baseURL}/permisos/allUser/`).toPromise();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cod_user');
    localStorage.removeItem('id_area');
  }
}
