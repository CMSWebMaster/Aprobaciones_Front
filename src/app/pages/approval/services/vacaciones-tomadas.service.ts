import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { IPeriodo } from '../models/vacaciones/periodo.interface';
import { environment } from 'src/environments/environment';
import { TipoPeriodoVacacionEnum } from 'src/app/enums/vacacion/tipo-periodo-vacacion.enum';
import { IFechaPagadaPeriodo } from '../models/vacaciones/fecha-pagada-periodo.interface';
import { IVacacionPorJefeResponsable } from '../models/vacaciones/vacacion-por-jefe-responsable.interface';

@Injectable({
	providedIn: 'root'
})
export class VacacionesTomadasService {
  readonly url = environment.api_url + '/vacaciones';

	constructor(private http: HttpClient) {}

	listarVacDelPersonalPorJefeResp(codUsu: string): Observable<Array<IVacacionPorJefeResponsable>> {
    const params = new HttpParams().append('codUsu', codUsu);
		return this.http.get<Array<IVacacionPorJefeResponsable>>(`${this.url}`, { params });
	}

	listarPeriodos(
    tipoPeriodo: TipoPeriodoVacacionEnum,
    codPersonal: string,
  ): Observable<Array<IPeriodo>> {
    let params = new HttpParams()
      .append('tipo', tipoPeriodo)
      .append('codPersonal', codPersonal);
		return this.http.get<Array<IPeriodo>>(`${this.url}/periodos`, { params });
	}

  listarFechasPagadasPorPeriodo(
    codTrab: string,
    numPeriodo: string,
  ): Observable<Array<IFechaPagadaPeriodo>> {
    const params = new HttpParams()
      .append('codTrab', codTrab)
      .append('numPeriodo', numPeriodo);

    return this.http.get<Array<IFechaPagadaPeriodo>>(
      `${this.url}/periodos/fechas-pagadas`,
      { params }
    )
      .pipe(
        map(lst => lst.map(obj => ({
          ...obj,
          FechaInicio: obj.FechaInicio?.split(' ')[0],
          FechaFin: obj.FechaFin?.split(' ')[0],
        })))
      );
  }
}
