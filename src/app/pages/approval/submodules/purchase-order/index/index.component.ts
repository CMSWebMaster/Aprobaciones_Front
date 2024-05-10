import { Component } from '@angular/core';
import { OrderDetailsComponent } from '../../../common/components/order-details/order-details.component';
import { OrderComponent } from '../../../common/components/order/order.component';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { IApprovalOrder } from '../../../models/IApprovalOrder';
import { IPurchaseOrderDetails } from '../../../models/IPurchaseOrderDetails';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [OrderDetailsComponent, OrderComponent],
	templateUrl: './index.component.html',
	styleUrl: './index.component.scss'
})
export class PurchaseOrderComponent {

	showDetails: boolean = false;
	rows: any = [];
	orderDetail: IPurchaseOrderDetails;
	userApprovers: IUsersAprrovers[] = [];

	constructor(public purchaseOrderService: PurchaseOrderService) {

	}

	ngOnInit() {
		this.listApprovalServicesOrder();
	}

	listApprovalServicesOrder() {
		this.purchaseOrderService.listApprovalPurchaseOrder('WLIVISACA', 1304).subscribe({
			next: (response) => {
				response = response.map((d: IApprovalOrder) => ({
					...d,
					Compromiso: `${d.NumeroOrden}-${d.Observaciones}`
				}));
				this.rows = [...response];
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	viewDetails(e: any) {
		const row = e.row as IPurchaseOrderDetails;
		this.userApprovers = e.userApprovers;
		this.purchaseOrderService.getPurchaseOrderDetails(row.NumeroOrden).subscribe({
			next: (response) => {
				this.orderDetail = response[0];
				this.showDetails = true;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	backOrders(e: boolean) {
		this.showDetails = !e;
	}
}
