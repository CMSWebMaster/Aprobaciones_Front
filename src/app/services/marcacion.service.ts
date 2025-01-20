import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponseMarcacion } from '../interfaces/marcacion/response-marcacion.interface';

@Injectable({
	providedIn: 'root',
})
export class MarcacionService {
	private url: string = environment.api_url + '/marcaciones';

	constructor(private http: HttpClient) {}

	public asistenciaColaborador(
    idColaborador: number,
    fechaInicio: string,
    fechaFin: string,
  ): Observable<Array<IResponseMarcacion>> {
    const params = new HttpParams()
      .append('idColaborador', idColaborador)
      .append('fechaInicio', fechaInicio)
      .append('fechaFin', fechaFin);
		return this.http.get<Array<IResponseMarcacion>>(`${this.url}/asistencia`, { params });
	}
}
