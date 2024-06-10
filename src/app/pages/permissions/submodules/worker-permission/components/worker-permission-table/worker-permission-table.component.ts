import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableResizeComponent } from 'src/app/commom/shared-components/table-resize/table-resize.component';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';
import { IWorkerPermission } from 'src/app/pages/permissions/models/IWorkerPermissionDetail';

@Component({
	selector: 'app-worker-permission-table',
	standalone: true,
	imports: [TableComponent, TableResizeComponent],
	templateUrl: './worker-permission-table.component.html',
	styleUrl: './worker-permission-table.component.scss'
})
export class WorkerPermissionTableComponent {

	columns = [{ name: 'Usuario Permiso', prop: 'Colaborador' }, { name: 'Fecha Desde', prop: 'FechaDesde' }, { name: 'Fecha Hasta', prop: 'FechaHasta' }, { name: 'Usuario Aprobador', prop: 'UsuarioAprobador' },
	{ name: 'Justificación', prop: 'Justificacion' }, { name: 'Estado', prop: 'IndicadorEstado' }];

	@Input() rows: any = [];
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();
	tableDetails: any = [];

	ngOnChanges(changes: any) {
		if (changes.rows && this.rows) {
			console.log(changes.rows);
			this.tableDetails = this.rows.map(row => {
				return {
					...row,
					Cabecera: row.Area,
					Detalle1: row.UsuarioAprobador,
					Detalle2: row.IndicadorEstado
				};
			});
		}
	}
	cellClicked(e: IWorkerPermission) {
		this.onEmitCellClicked.emit(e);
	}
}
