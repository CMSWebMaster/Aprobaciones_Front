import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';

@Component({
	selector: 'app-orders-table',
	standalone: true,
	imports: [TableComponent],
	templateUrl: './orders-table.component.html',
	// styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {

	columns = [{ prop: 'Compromiso', name: 'Compromiso' }, { name: 'Descripción', prop: 'DescripcionLocal' }, { name: 'Nombre', prop: 'Nombre' }];
	@Input() rows: any = [];
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();

	cellClicked(e: any) {
		this.onEmitCellClicked.emit(e);
	}
}
