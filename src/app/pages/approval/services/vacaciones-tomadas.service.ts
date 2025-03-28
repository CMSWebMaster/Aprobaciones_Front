import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { IPeriodo } from '../models/vacaciones/periodo.interface';
import { environment } from 'src/environments/environment';
import { TipoPeriodoVacacionEnum } from 'src/app/enums/vacacion/tipo-periodo-vacacion.enum';
import { IFechaPagadaPeriodo } from '../models/vacaciones/fecha-pagada-periodo.interface';
import { IVacacionPorJefeResponsable } from '../models/vacaciones/vacacion-por-jefe-responsable.interface';
import { IVacacionSolicitada } from '../models/vacaciones/response-vacacion-solicitada.interface';
import { IRequestAnularVacacion } from 'src/app/interfaces/vacacion/request-anular-vacacion.interface';
import { IRequestRechazarVacacion } from 'src/app/interfaces/vacacion/request-rechazar-vacacion.interface';
import { IRequestAprobarVacacionXJefe } from 'src/app/interfaces/vacacion/request-aprobar-vacacion-x-jefe.interface';
import { IRequestRegistrarVacacionXRRHH } from 'src/app/interfaces/vacacion/request-registrar-vacacion-x-rrhh.interface copy';

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

	solicitarVacacionesPendientes(
    codTrab: string,
    codPeriodoVacacional: string,
    fechaInicio: string,
    fechaFin: string,
    jefeResponsable: string,
  ): Observable<Array<IPeriodo>> {
		return this.http.post<Array<IPeriodo>>(this.url, {
      codTrab,
      codPeriodoVacacional,
      fechaInicio,
      fechaFin,
      jefeResponsable,
    });
	}

  listarVacacionesSolicitadas(codTrab: string): Observable<Array<IVacacionSolicitada>> {
    const params = new HttpParams().append('codTrab', codTrab);
		return this.http.get<Array<IVacacionSolicitada>>(`${this.url}/aprobaciones`, { params });
	}

  listarVacacionesSolicitadasXAprobar(codJefeResp: string): Observable<Array<IVacacionSolicitada>> {
    const params = new HttpParams().append('codJefeResp', codJefeResp);
		return this.http.get<Array<IVacacionSolicitada>>(`${this.url}/aprobaciones/por-jefe-responsable`, { params });
	}

  listarVacacionesAprobadasXRegistrar(): Observable<Array<IVacacionSolicitada>> {
		return this.http.get<Array<IVacacionSolicitada>>(`${this.url}/aprobaciones/por-rrhh`);
	}

  anularVacacion(parametros: IRequestAnularVacacion) {
		return this.http.put(`${this.url}/anular-pendiente`, parametros);
	}

  rechazarVacacion(parametros: IRequestRechazarVacacion) {
		return this.http.put(`${this.url}/rechazar-pendiente`, parametros);
	}

  aprobarVacacion(parametros: IRequestAprobarVacacionXJefe) {
		return this.http.put(`${this.url}/aprobar-pendiente`, parametros);
	}

  registrarVacacion(parametros: IRequestAprobarVacacionXJefe) {
		return this.http.put(`${this.url}/registrar-pendiente`, parametros);
	}

  aprobarVacacionRegistrada(parametros: IRequestRegistrarVacacionXRRHH) {
		return this.http.put(`${this.url}/registrar-aprobado`, parametros);
	}
}
