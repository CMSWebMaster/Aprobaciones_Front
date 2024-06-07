import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	response: Observable<any>;
	apiLogin: string = environment.api_login;
	private messageSource = new BehaviorSubject(localStorage.getItem('title'));
	currentMessage = this.messageSource.asObservable();
	constructor(private http: HttpClient) {
		//this.baseURL = '/api';
	}
	changeMessage(message: string) {
		this.messageSource.next(message)
	}
	get token(): string {
		return localStorage.getItem('token') || '';
	}

	get headers() {
		return {
			headers: {
				'x-token': this.token
			}
		}
	}
	// validarToken(): Observable<boolean> {
	validarToken() {
		return this.http.get(`${this.apiLogin}/info/renew`, this.headers).pipe(
			tap((resp: any) => {
				localStorage.setItem('token', resp.token);
			}),
			map(resp => true),
			catchError(error => of(false))
		)
	}

	//Service Login
	postLoginService(data) {
		return this.http.post(`${this.apiLogin}/users/login`, data).toPromise();
	}
	getProfileUserService(data) {
		return this.http.post(`${this.apiLogin}/users/profile`, data).toPromise();
	}
	//USER
	postUserService(data) {
		return this.http.post(`${this.apiLogin}/info`, data).toPromise();
	}
	//DELETE
	deleteUserService(id) {
		return this.http.delete(`${this.apiLogin}/info/${id}`).toPromise();
	}
	//USER LIST
	getUserListService() {
		return this.http.get(`${this.apiLogin}/info`).toPromise();
	}
	//UPDATE
	updateUserService(data) {
		return this.http.put(`${this.apiLogin}/info`, data).toPromise();
	}
	//
	getUserBrIdService(persona) {
		return this.http.get(`${this.apiLogin}/info/${persona}`).toPromise();
	}
	//ROLES //
	getRolesByService(idrol, persona) {
		console.log(70, idrol, persona)
		return this.http.get(`${this.apiLogin}/permisos/rol/${idrol}/${persona}`).toPromise();
	}

}
