import { Component, OnInit } from '@angular/core';
import { ServicesOrderService } from '../../../services/services-order.service';
import { OrderDetailsComponent } from '../../../common/components/order-details/order-details.component';
import { OrderComponent } from '../../../common/components/order/order.component';
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
export class ServicesOrderComponent implements OnInit {

	showDetails: boolean = false;
	rows: any = [];
	orderDetail: IPurchaseOrderDetails;
	userApprovers: IUsersAprrovers[] = [];
	persona: string = '';
	codUser: number = 0;

	constructor(public servicesOrderService: ServicesOrderService) {
		this.persona = localStorage.getItem('CodigoUsuario');
		this.codUser = parseInt(localStorage.getItem('cod_user'));
	}

	ngOnInit() {
		this.listApprovalServicesOrder();
	}

	listApprovalServicesOrder() {
		this.servicesOrderService.listApprovalServicesOrder(this.persona, this.codUser).subscribe({
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
		this.listApprovalServicesOrder();
		this.showDetails = !e;
	}

	executeApproval(e: boolean) {
		const { Clasificacion, CompaniaSocio, Estado, MontoAfecto, NivelAprobacion, UnidadNegocio, NumeroCompromiso } = this.orderDetail
		const requestApproval: IExecuteApprovalOrders = {
			Clasificacion,
			CompaniaSocio,
			Estado,
			MontoBruto: 0,
			NivelAprobacion,
			UnidadNegocio,
			NumeroOrden: '',
			IdUser: this.persona,
			Persona: this.codUser,
			MontoAfecto,
			NumeroCompromiso
		};

		this.servicesOrderService.executeApprovalServiceOrder(requestApproval).subscribe({
			next: (response) => {
				console.log(response);
				Swal.fire({
					icon: 'success',
					title: 'APROBADO!',
					text: 'La orden fue APROBADA con éxito.',
				});
				this.showDetails = false;
				this.listApprovalServicesOrder();
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
