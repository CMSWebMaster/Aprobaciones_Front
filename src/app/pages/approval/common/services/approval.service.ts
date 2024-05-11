import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsersAprrovers } from '../../models/IUsersApprovers';
import { Observable, catchError, of } from 'rxjs';
import { ApprovalConstants } from '../constants/approval.constants';
import { IExecuteApprovalOrders } from '../../models/IExecuteApprovalOrders';

@Injectable({
	providedIn: 'root'
})
export class ApprovalService {

	constructor(private http: HttpClient) { }

	getUsersApprovers(numeroOrden: string, typeApproval: string): Observable<IUsersAprrovers[]> {
		return this.http
			.get<IUsersAprrovers[]>(`${ApprovalConstants.BASE_URL}/${ApprovalConstants.GET_USERS_APPROVERS}/${numeroOrden}/${typeApproval}`)
			.pipe(catchError((err) => of(err)));
	}
}
