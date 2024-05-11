import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPurchaseOrderDetails } from '../../../models/IPurchaseOrderDetails';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';
import Swal from 'sweetalert2';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { ServicesOrderService } from '../../../services/services-order.service';

@Component({
	selector: 'app-order-details',
	standalone: true,
	imports: [CommonModule, NgbPopover],
	templateUrl: './order-details.component.html',
	styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
	@Input() showDetails: boolean = true;
	@Input() orderDetail: IPurchaseOrderDetails;
	@Input() userApprovers: IUsersAprrovers[] = [];
	@Output() onEmitBackOrder: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitExecuteApproval: EventEmitter<boolean> = new EventEmitter<boolean>();

	currencyDocument: string = '';

	constructor(public purchaseOrderService: PurchaseOrderService, public servicesOrderService: ServicesOrderService) {

	}


	ngOnChanges(changes: any) {
		console.log(changes);
		if (changes.orderDetail && this.orderDetail) {
			this.currencyDocument = this.orderDetail.MonedaDocumento ?? this.orderDetail.MonedaCodigo === 'LO' ? 'S/.' : '$.';
		}
	}

	backOrderTable() {
		this.onEmitBackOrder.emit(true);
	}

	executeApprovalOrder() {
		Swal.fire({
			icon: 'question',
			title: 'APROBAR ORDER.',
			text: 'Está seguro de APROBAR la orden de compra?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.onEmitExecuteApproval.emit(true);
			}
		});

	}
}
