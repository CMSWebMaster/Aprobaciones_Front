import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { typeOrderEnum } from 'src/app/pages/approval/common/enums/typeOrder.enum';
import { IOrderDetail } from 'src/app/pages/approval/models/IOrderDetail';
import { IUsersAprrovers } from 'src/app/pages/approval/models/IUsersApprovers';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-orders-summary',
	standalone: true,
	imports: [NgbPopover, CommonModule],
	templateUrl: './orders-summary.component.html',
	styleUrl: './orders-summary.component.scss'
})
export class OrdersSummaryComponent {
	@Input() orderDetail: IOrderDetail;
	@Input() userApprovers: IUsersAprrovers[] = [];
	@Output() onEmitBackOrder: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitExecuteApproval: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() typeOrder: typeOrderEnum;

	currencyDocument: string = '';
	headerDetail: string = '';

	constructor() {

	}

	ngOnChanges(changes: any) {
		console.log(changes);
		if (changes.orderDetail && this.orderDetail) {
			this.currencyDocument = this.orderDetail.MonedaDocumento ?? this.orderDetail.MonedaCodigo === 'LO' ? 'S/.' : '$.';
			this.headerDetail = this.typeOrder === typeOrderEnum.OC ? `${this.orderDetail.NumeroOrden}-${this.orderDetail.Observaciones}` : `${this.orderDetail.NumeroCompromiso}-${this.orderDetail.Descripcion}`
		}
	}

	backOrderTable() {
		this.onEmitBackOrder.emit(true);
	}

	executeApprovalOrder() {
		Swal.fire({
			icon: 'question',
			title: 'APROBAR ORDEN.',
			text: 'Está seguro de APROBAR la orden?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.onEmitExecuteApproval.emit(true);
			}
		});

	}
}
