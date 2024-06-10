import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableResizeComponent } from 'src/app/commom/shared-components/table-resize/table-resize.component';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';
import { IApprovalOrder } from 'src/app/pages/approval/models/IApprovalOrder';

@Component({
	selector: 'app-orders-table',
	standalone: true,
	imports: [TableComponent, TableResizeComponent],
	templateUrl: './orders-table.component.html',
	// styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {

	columns = [{ prop: 'Compromiso', name: 'Compromiso' }, { name: 'Descripción', prop: 'DescripcionLocal' }, { name: 'Nombre', prop: 'Nombre' }];
	@Input() rows: IApprovalOrder[] = [];
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();
	tableDetails: any = [];

	ngOnChanges(changes: any) {
		if (changes.rows && this.rows) {
			console.log(changes.rows);
			this.tableDetails = this.rows.map(row => {
				return {
					...row,
					Cabecera: row.Compromiso,
					Detalle1: row.DescripcionLocal,
					Detalle2: row.Nombre
				};
			});
		}
	}

	cellClicked(e: any) {
		this.onEmitCellClicked.emit(e);
	}
}
