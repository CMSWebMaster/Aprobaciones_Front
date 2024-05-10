import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPurchaseOrderDetails } from '../../../models/IPurchaseOrderDetails';
import { IServiceOrderDetails } from '../../../models/IServicesOrderDetails';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IUsersAprrovers } from '../../../models/IUsersApprovers';

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

	currencyDocument: string = '';

	ngOnChanges(changes: any) {
		console.log(changes);
		if (changes.orderDetail && this.orderDetail) {
			this.currencyDocument = this.orderDetail.MonedaDocumento ?? this.orderDetail.MonedaCodigo === 'LO' ? 'S/.' : '$.';
		}
	}

	backOrderTable() {
		this.onEmitBackOrder.emit(true);
	}
}
