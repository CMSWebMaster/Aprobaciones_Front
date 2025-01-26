import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVacacionPorJefeResponsable } from '../models/vacaciones/vacacion-por-jefe-responsable.interface';
import {catchError} from "rxjs/operators";

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


  // Metodo para obtener pacientes internados inicio
  obtenerPacientesInternadosPOST(filtro: { sede: string; fecha: string }): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/v1/pacientes-internados`, filtro);
  }
  // Metodo para obtener pacientes internados fin

  // Metodo para obtener pacientes programador inicio
  obtenerPacientesProgramadosOperaciones(filtro: { sede: string; fecha: string }): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/v1/pacientes-programados`, filtro);
  }
  // Metodo para obtener pacientes programador fin


}
