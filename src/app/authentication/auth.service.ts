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
	apiUrl: string = environment.api_url;
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
		return this.http.get(`${this.apiUrl}/info/renew`, this.headers).pipe(
			tap((resp: any) => {
				localStorage.setItem('token', resp.token);
			}),
			map(resp => true),
			catchError(error => of(false))
		)
	}

	//Service Login
	postLoginService(data) {
		return this.http.post(`${this.apiUrl}/users/login`, data).toPromise();
	}
	getProfileUserService(data) {
		return this.http.post(`${this.apiUrl}/users/profile`, data).toPromise();
	}
	//USER
	postUserService(data) {
		return this.http.post(`${this.apiUrl}/info`, data).toPromise();
	}
	//DELETE
	deleteUserService(id) {
		return this.http.delete(`${this.apiUrl}/info/${id}`).toPromise();
	}
	//USER LIST
	getUserListService() {
		return this.http.get(`${this.apiUrl}/info`).toPromise();
	}
	//UPDATE
	updateUserService(data) {
		return this.http.put(`${this.apiUrl}/info`, data).toPromise();
	}
	//
	getUserBrIdService(persona) {
		return this.http.get(`${this.apiUrl}/info/${persona}`).toPromise();
	}
	//ROLES //
	getRolesByService(idrol, persona) {
		console.log(70, idrol, persona)
		return this.http.get(`${this.apiUrl}/permisos/rol/${idrol}/${persona}`).toPromise();
	}

}
