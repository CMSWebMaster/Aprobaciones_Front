import { Component, OnInit } from '@angular/core';
import { OrdersTableComponent } from '../components/orders-table/orders-table.component';
import { OrdersSummaryComponent } from '../components/orders-summary/orders-summary.component';
import { OrdersService } from '../../../services/orders.service';
import { typeOrderEnum } from '../../../common/enums/typeOrder.enum';
import { IApprovalOrder } from '../../../models/IApprovalOrder';
import { ActivatedRoute } from '@angular/router';
import { IOrderDetail } from '../../../models/IOrderDetail';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';
import { IExecuteApprovalOrders } from '../../../models/IExecuteApprovalOrders';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [OrdersTableComponent, OrdersSummaryComponent],
	templateUrl: './index.component.html',
	styleUrl: './index.component.scss'
})
export class OrdersComponent implements OnInit {

	showDetails: boolean = false;
	persona: string = '';
	codUser: number = 0;
	rows: any = [];
	orderDetail: IOrderDetail;
	typeOrder: typeOrderEnum;
	userApprovers: IUsersAprrovers[] = [];

	constructor(private ordersService: OrdersService, private route: ActivatedRoute) {
		this.persona = localStorage.getItem('CodigoUsuario');
		this.codUser = parseInt(localStorage.getItem('cod_user'));
	}

	ngOnInit() {

		this.route.paramMap.subscribe(params => {
			this.typeOrder = +params.get('id');
			this.listApprovalOrders();
		});
	}

	listApprovalOrders() {
		this.showDetails = false;
		this.ordersService.listApprovalOrders(this.persona, this.codUser, this.typeOrder).subscribe({
			next: (response) => {
				response = response.map((d: IApprovalOrder) => ({
					...d,
					Compromiso: this.typeOrder === typeOrderEnum.OC ? `${d.NumeroOrden}-${d.Observaciones}` : `${d.NumeroCompromiso}-${d.Descripcion}`
				}));
				this.rows = [...response];
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	cellClicked(e: IOrderDetail) {
		this.getOrderDetail(e);
		this.getUsersApprovers(e);
	}

	getOrderDetail(row: IOrderDetail) {
		const parameter = this.typeOrder === typeOrderEnum.OC ? row.NumeroOrden : row.NumeroCompromiso;
		this.ordersService.getOrderDetail(parameter, this.typeOrder).subscribe({
			next: (response) => {
				this.orderDetail = response[0];
				this.showDetails = true;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	getUsersApprovers(row: IOrderDetail) {
		this.ordersService.getUsersApprovers(this.typeOrder === typeOrderEnum.OC ? row.NumeroOrden : row.NumeroCompromiso, this.typeOrder).subscribe({
			next: (response) => {
				this.userApprovers = response;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	backToOrderTable() {
		this.listApprovalOrders();
		this.showDetails = false;
	}

	executeApproval() {
		const { Clasificacion, CompaniaSocio, Estado, MontoBruto, MontoAfecto, NivelAprobacion, UnidadNegocio, NumeroOrden, NumeroCompromiso } = this.orderDetail
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
			MontoAfecto,
			NumeroCompromiso
		};

		this.ordersService.executeApprovalOrder(requestApproval, this.typeOrder).subscribe({
			next: (response) => {
				Swal.fire({
					icon: 'success',
					title: 'APROBADO!',
					text: 'La orden fue APROBADA con éxito.',
				});
				this.showDetails = false;
				this.listApprovalOrders();
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
