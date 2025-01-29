import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponseJefeResponsable } from 'src/app/interfaces/jefe-responsable/response-jefe-responsable.interface';

@Injectable({
	providedIn: 'root'
})
export class JefeResponsableService {
  readonly url = environment.api_url + '/jefe-responsable';

	constructor(private http: HttpClient) {}

	listarPeriodos(
    nombre: string,
    codUsuario: string,
  ): Observable<Array<IResponseJefeResponsable>> {
    let params = new HttpParams();
    if (nombre) {
      params = params.append('nombre', nombre);
    }
    if (codUsuario) {
      params = params.append('codUsuario', codUsuario);
    }
		return this.http.get<Array<IResponseJefeResponsable>>(this.url, { params });
	}
}
