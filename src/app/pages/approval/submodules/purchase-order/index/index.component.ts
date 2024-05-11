import { Component } from '@angular/core';
import { OrderDetailsComponent } from '../../../common/components/order-details/order-details.component';
import { OrderComponent } from '../../../common/components/order/order.component';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { IApprovalOrder } from '../../../models/IApprovalOrder';
import { IPurchaseOrderDetails } from '../../../models/IPurchaseOrderDetails';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';
import { IExecuteApprovalOrders } from '../../../models/IExecuteApprovalOrders';
import Swal from 'sweetalert2';

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
	persona: string = '';
	codUser: number = 0;

	constructor(public purchaseOrderService: PurchaseOrderService) {
		this.persona = localStorage.getItem('CodigoUsuario');
		this.codUser = parseInt(localStorage.getItem('cod_user'));
	}

	ngOnInit() {
		this.listApprovalPurchaseOrder();
	}

	listApprovalPurchaseOrder() {
		this.purchaseOrderService.listApprovalPurchaseOrder(this.persona, this.codUser).subscribe({
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
		this.listApprovalPurchaseOrder();
		this.showDetails = !e;
	}

	executeApproval(e: boolean) {
		const { Clasificacion, CompaniaSocio, Estado, MontoBruto, NivelAprobacion, UnidadNegocio, NumeroOrden } = this.orderDetail
		const requestApproval: IExecuteApprovalOrders = {
			Clasificacion,
			CompaniaSocio,
			Estado,
			MontoBruto,
			NivelAprobacion,
			UnidadNegocio,
			NumeroOrden,
			IdUser: this.persona,
			Persona: this.codUser,
			MontoAfecto: 0,
			NumeroCompromiso: ''
		};

		this.purchaseOrderService.executeApprovalPurchaseOrder(requestApproval).subscribe({
			next: (response) => {
				Swal.fire({
					icon: 'success',
					title: 'APROBADO!',
					text: 'La orden fue APROBADA con éxito.',
				});
				this.showDetails = false;
				this.listApprovalPurchaseOrder();
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
