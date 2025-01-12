import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVacacionPorJefeResponsable } from '../models/vacaciones/vacacion-por-jefe-responsable.interface';

@Injectable({
	providedIn: 'root'
})
export class EmergenciasService {
  readonly urlApi = environment.api;
  readonly urlApiApr = environment.api_url;

	constructor(private http: HttpClient) {}

	buscarEmerConsultaHoteleria(filtro: object): Observable<Array<IVacacionPorJefeResponsable>> {
		return this.http.post<Array<IVacacionPorJefeResponsable>>(
      `${this.urlApi}/v1/emergenciasConsultaHoteleria`,
      filtro
    );
	}
}
