import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponsePermiso } from 'src/app/interfaces/permiso/response-permiso.interface';
import { IRequestAprobarPermiso } from 'src/app/interfaces/permiso/request-aprobar-permiso.interface';

@Injectable({
	providedIn: 'root'
})
export class AprobacionesRRHHService {
  readonly url = environment.api_url + '/Permission/aprobaciones/rrhh';

	constructor(private http: HttpClient) {}

	listarPendientesAprobacion(): Observable<Array<IResponsePermiso>> {
		return this.http.get<Array<IResponsePermiso>>(this.url);
	}

  aprobar(parametros: IRequestAprobarPermiso) {
		return this.http.put(`${this.url}/aprobar`, parametros);
	}
}
