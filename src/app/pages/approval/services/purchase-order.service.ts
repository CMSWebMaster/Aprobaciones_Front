import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { IApprovalOrder } from '../models/IApprovalOrder';
import { PurchaseOrderConstants } from '../common/constants/purchase-order.constants';
import { HttpClient } from '@angular/common/http';
import { IPurchaseOrderDetails } from '../models/IPurchaseOrderDetails';
import { IUsersAprrovers } from '../models/IUsersApprovers';

@Injectable({
	providedIn: 'root'
})
export class PurchaseOrderService {

	constructor(private http: HttpClient) { }

	listApprovalPurchaseOrder(iduser: string, persona: number): Observable<IApprovalOrder[]> {
		return this.http
			.get<IApprovalOrder[]>(`${PurchaseOrderConstants.BASE_URL}/${PurchaseOrderConstants.LIST_APPROVAL_PURCHASE_ORDER}/${iduser}/${persona}`)
			.pipe(catchError((err) => of(err)));
	}
	getPurchaseOrderDetails(numeroOrden: string): Observable<IPurchaseOrderDetails[]> {
		return this.http
			.get<IPurchaseOrderDetails[]>(`${PurchaseOrderConstants.BASE_URL}/${PurchaseOrderConstants.GET_PURCHASE_ORDER_DETAILS}/${numeroOrden}`)
			.pipe(catchError((err) => of(err)));
	}
}
