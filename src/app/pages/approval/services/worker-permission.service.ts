import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { IWorkerPermission } from '../models/IWorkerPermissionDetail';
import { WorkerPermissionConstants } from '../common/constants/worker-permission.constants';
import { IAddWorkerPermission } from '../models/IAddWorkerPermission';

@Injectable({
	providedIn: 'root'
})
export class WorkerPermissionService {

	constructor(private http: HttpClient) { }

	listWorkerPermission(codUser: string): Observable<IWorkerPermission[]> {
		return this.http
			.get<IWorkerPermission[]>(`${WorkerPermissionConstants.BASE_URL}/${WorkerPermissionConstants.LIST_WORKER_PERMISSION}/${codUser}`)
			.pipe(catchError((err) => of(err)));
	}
	addWorkerPermission(request: IAddWorkerPermission): Observable<boolean> {
		return this.http.post<boolean>(`${WorkerPermissionConstants.BASE_URL}/${WorkerPermissionConstants.ADD_WORKER_PERMISSION}`, request);
	}
}
