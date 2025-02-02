import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponsePermiso } from 'src/app/interfaces/permiso/response-permiso.interface';
import { IRequestAprobarPermisoXPerSeg } from 'src/app/interfaces/permiso/request-aprobar-permiso-x-per-seg.interface';

@Injectable({
	providedIn: 'root'
})
export class AprobacionesSeguridadService {
  readonly url = environment.api_url + '/Permission/aprobaciones/seguridad';

	constructor(private http: HttpClient) {}

	listarAprobados(): Observable<Array<IResponsePermiso>> {
		return this.http.get<Array<IResponsePermiso>>(this.url);
	}

  aprobar(parametros: IRequestAprobarPermisoXPerSeg) {
		return this.http.put(`${this.url}/aprobar`, parametros);
	}
}
