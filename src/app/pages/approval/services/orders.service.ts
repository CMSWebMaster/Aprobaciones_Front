import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdersConstants } from '../common/constants/orders.constants';
import { IApprovalOrder } from '../models/IApprovalOrder';
import { Observable, catchError, of } from 'rxjs';
import { typeOrderEnum } from '../common/enums/typeOrder.enum';
import { IExecuteApprovalOrders } from '../models/IExecuteApprovalOrders';
import { IOrderDetail } from '../models/IOrderDetail';
import { IUsersAprrovers } from '../models/IUsersApprovers';
import { typeOrderMappings } from '../common/mapping/typeOrder.mapping';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {

	constructor(private http: HttpClient) { }

	listApprovalOrders(iduser: string, persona: number, typeOrder: typeOrderEnum): Observable<IApprovalOrder[]> {
		const method = typeOrder === typeOrderEnum.OC ? OrdersConstants.LIST_APPROVAL_PURCHASE_ORDER : OrdersConstants.LIST_APPROVAL_SERVICES_ORDER;

		return this.http
			.get<IApprovalOrder[]>(`${OrdersConstants.BASE_URL}/${method}/${iduser}/${persona}`)
			.pipe(catchError((err) => of(err)));
	}
	getOrderDetail(parameter: string, typeOrder: typeOrderEnum): Observable<IOrderDetail[]> {
		const method = typeOrder === typeOrderEnum.OC ? OrdersConstants.GET_PURCHASE_ORDER_DETAILS : OrdersConstants.GET_SERVICE_ORDER_DETAILS;

		return this.http
			.get<IOrderDetail[]>(`${OrdersConstants.BASE_URL}/${method}/${parameter}`)
			.pipe(catchError((err) => of(err)));
	}
	executeApprovalOrder(request: IExecuteApprovalOrders, typeOrder: typeOrderEnum): Observable<boolean> {
		const method = typeOrder === typeOrderEnum.OC ? OrdersConstants.EXECUTE_APPROVAL_PURCHASE_ORDER : OrdersConstants.EXECUTE_APPROVAL_SERVICE_ORDER;

		return this.http.post<boolean>(`${OrdersConstants.BASE_URL}/${method}`, request);
	}
	getUsersApprovers(parameter: string, typeOrder: typeOrderEnum): Observable<IUsersAprrovers[]> {

		return this.http
			.get<IUsersAprrovers[]>(`${OrdersConstants.BASE_URL}/${OrdersConstants.GET_USERS_APPROVERS}/${parameter}/${typeOrderMappings[typeOrder]}`)
			.pipe(catchError((err) => of(err)));
	}
}
