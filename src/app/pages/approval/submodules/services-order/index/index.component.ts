import { Component, OnInit } from '@angular/core';
import { ServicesOrderService } from '../../../services/services-order.service';
import { OrderDetailsComponent } from '../../../common/components/order-details/order-details.component';
import { OrderComponent } from '../../../common/components/order/order.component';
import { IApprovalOrder } from '../../../models/IApprovalOrder';
import { IPurchaseOrderDetails } from '../../../models/IPurchaseOrderDetails';
import { IServiceOrderDetails } from '../../../models/IServicesOrderDetails';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [OrderDetailsComponent, OrderComponent],
	templateUrl: './index.component.html',
	styleUrl: './index.component.scss'
})
export class ServicesOrderComponent implements OnInit {

	showDetails: boolean = false;
	rows: any = [];
	orderDetail: IPurchaseOrderDetails;
	userApprovers: IUsersAprrovers[] = [];

	constructor(public servicesOrderService: ServicesOrderService) {

	}

	ngOnInit() {
		this.listApprovalServicesOrder();
	}

	listApprovalServicesOrder() {
		this.servicesOrderService.listApprovalServicesOrder('WLIVISACA', 1304).subscribe({
			next: (response) => {
				response = response.map((d: IApprovalOrder) => ({
					...d,
					Compromiso: `${d.NumeroCompromiso}-${d.Descripcion}`
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
		this.servicesOrderService.getServicesOrderDetails(row.NumeroCompromiso).subscribe({
			next: (response) => {
				const orderDetail = response[0] as IPurchaseOrderDetails;
				this.orderDetail = orderDetail;
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
