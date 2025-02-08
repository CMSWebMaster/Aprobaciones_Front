import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRequestCentroCostosAutParaUsu } from 'src/app/interfaces/aprobacion-servicios/centro-costos-aut-para-usu/request-centro-costos-aut-para-usu.interface';
import { IResponseCentroCostosAutParaUsu } from 'src/app/interfaces/aprobacion-servicios/centro-costos-aut-para-usu/response-centro-costos-aut-para-usu.interface';
import { IRequestOrdServPendConfirmar } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-pendientes-confirmar/request-ordenes-servicio-pendientes-confirmar.interface';
import { IResponseOrdServPendConfirmar } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-pendientes-confirmar/response-ordenes-servicio-pendientes-confirmar.interface';
import { IResponseOrdenServicioParaConfirmar } from 'src/app/interfaces/aprobacion-servicios/orden-servicio-para-confirmar/response-orden-servicio-para-confirmar.interface';
import { IRequestOrdenServicioParaConfirmar } from 'src/app/interfaces/aprobacion-servicios/orden-servicio-para-confirmar/request-orden-servicio-para-confirmar.interface';
import { IRequestConfirmarServicio } from 'src/app/interfaces/aprobacion-servicios/confirmar-servicio/request-confirmar-servicio.interface';
import { IRequestOrdServConfirmadas } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-confirmadas/request-ordenes-servicio-confirmadas.interface';
import { IResponseOrdServConfirmadas } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-confirmadas/response-ordenes-servicio-confirmadas.interface';
import { IRequestDesconfirmarServicio } from 'src/app/interfaces/aprobacion-servicios/desconfirmar-servicio/request-desconfirmar-servicio.interface';

@Injectable({
	providedIn: 'root'
})
export class AprobacionServiciosService {
  readonly url = environment.api_url + '/aprobacion-servicios';

	constructor(private http: HttpClient) {}

	validarAccesoOpcionConformidad(codUsuario: string) {
    const params = new HttpParams().append('codUsuario', codUsuario);
		return this.http.get(
      `${this.url}/validar-acceso-opcion-conformidad`,
      { params }
    );
	}

	validarPuedeRealizarConformidadServicio(codUsuario: string) {
    const params = new HttpParams().append('codUsuario', codUsuario);
		return this.http.get(
      `${this.url}/validar-puede-realizar-conformidad-servicio`,
      { params }
    );
	}

	validarPuedeRealizarDesconformidadServicio(codUsuario: string) {
    const params = new HttpParams().append('codUsuario', codUsuario);
		return this.http.get(
      `${this.url}/validar-puede-realizar-desconformidad-servicio`,
      { params }
    );
	}

	centroCostosAutorizadosParaUsuario(datos: IRequestCentroCostosAutParaUsu):
    Observable<Array<IResponseCentroCostosAutParaUsu>>
  {
    const params = new HttpParams().append('codUsuario', datos.codUsuario);
		return this.http.get<Array<IResponseCentroCostosAutParaUsu>>(
      `${this.url}/centro-costos-autorizados-para-usuario`,
      { params }
    );
	}

	ordenesServicioPendientesConfirmar(datos: IRequestOrdServPendConfirmar):
    Observable<Array<IResponseOrdServPendConfirmar>>
  {
    const params = new HttpParams()
      .append('centroCosto', datos.centroCosto)
      .append('codUsuario', datos.codUsuario);

		return this.http.get<Array<IResponseOrdServPendConfirmar>>(
      `${this.url}/ordenes-servicio-pendientes-confirmar`,
      { params }
    );
	}

  ordenesServicioConfirmadas(datos: IRequestOrdServConfirmadas):
    Observable<Array<IResponseOrdServConfirmadas>>
  {
    const params = new HttpParams()
      .append('centroCosto', datos.centroCosto)
      .append('codUsuario', datos.codUsuario);

		return this.http.get<Array<IResponseOrdServConfirmadas>>(
      `${this.url}/ordenes-servicio-confirmadas`,
      { params }
    );
	}

	ordenServicioSeleccionadaParaConfirmar(datos: IRequestOrdenServicioParaConfirmar):
    Observable<IResponseOrdenServicioParaConfirmar>
  {
    const params = new HttpParams()
      .append('numeroCompromiso', datos.numeroCompromiso)
      .append('lineaDetalle', datos.lineaDetalle);

		return this.http.get<IResponseOrdenServicioParaConfirmar>(
      `${this.url}/orden-servicio-seleccionada-para-confirmar`,
      { params }
    );
	}

  confirmarServicio(datos: IRequestConfirmarServicio) {
    const params = new HttpParams()
      .append('tipoCompromiso', datos.tipoCompromiso)
      .append('numeroCompromiso', datos.numeroCompromiso)
      .append('lineaDetalle', datos.lineaDetalle)
      .append('monto', datos.monto)
      .append('comentario', datos.comentario)
      .append('usuario', datos.usuario);

		return this.http.post(`${this.url}/confirmar-servicio`, params);
	}

  desconfirmarServicio(datos: IRequestDesconfirmarServicio) {
    const params = new HttpParams()
      .append('codProveedor', datos.codProveedor)
      .append('docReferencia', datos.docReferencia)
      .append('usuario', datos.usuario);

		return this.http.post(`${this.url}/desconfirmar-servicio`, params);
	}
}
