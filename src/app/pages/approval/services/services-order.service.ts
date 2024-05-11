import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApprovalOrder } from '../models/IApprovalOrder';
import { ServicesOrderConstants } from '../common/constants/services-order.constants';
import { IPurchaseOrderDetails } from '../models/IPurchaseOrderDetails';
import { IServiceOrderDetails } from '../models/IServicesOrderDetails';
import { IExecuteApprovalOrders } from '../models/IExecuteApprovalOrders';

@Injectable({
	providedIn: 'root'
})
export class ServicesOrderService {

	constructor(private http: HttpClient) { }

	listApprovalServicesOrder(iduser: string, persona: number): Observable<IApprovalOrder[]> {
		return this.http
			.get<IApprovalOrder[]>(`${ServicesOrderConstants.BASE_URL}/${ServicesOrderConstants.LIST_APPROVAL_SERVICES_ORDER}/${iduser}/${persona}`)
			.pipe(catchError((err) => of(err)));
	}
	getServicesOrderDetails(numeroCompromiso: string): Observable<IServiceOrderDetails[]> {
		return this.http
			.get<IServiceOrderDetails[]>(`${ServicesOrderConstants.BASE_URL}/${ServicesOrderConstants.GET_SERVICE_ORDER_DETAILS}/${numeroCompromiso}`)
			.pipe(catchError((err) => of(err)));
	}
	executeApprovalServiceOrder(request: IExecuteApprovalOrders): Observable<boolean> {
		return this.http.post<boolean>(`${ServicesOrderConstants.BASE_URL}/${ServicesOrderConstants.EXECUTE_APPROVAL_SERVICE_ORDER}`, request);
	}
}
