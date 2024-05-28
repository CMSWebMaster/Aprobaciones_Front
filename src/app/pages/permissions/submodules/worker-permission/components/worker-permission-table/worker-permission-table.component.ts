import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';
import { IWorkerPermission } from 'src/app/pages/permissions/models/IWorkerPermissionDetail';

@Component({
	selector: 'app-worker-permission-table',
	standalone: true,
	imports: [TableComponent],
	templateUrl: './worker-permission-table.component.html',
	styleUrl: './worker-permission-table.component.scss'
})
export class WorkerPermissionTableComponent {

	columns = [{ name: 'Usuario Permiso', prop: 'Colaborador' }, { name: 'Fecha Desde', prop: 'FechaDesde' }, { name: 'Fecha Hasta', prop: 'FechaHasta' }, { name: 'Usuario Aprobador', prop: 'UsuarioAutorizacion' },
	{ name: 'Justificación', prop: 'Justificacion' }, { name: 'Estado', prop: 'EstadoAutorizacion' }];

	@Input() rows: any = [];
	@Output() onEmitCreateWorkerPermission: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();

	createWorkerPermission() {
		this.onEmitCreateWorkerPermission.emit();
	}

	cellClicked(e: IWorkerPermission) {
		this.onEmitCellClicked.emit(e);
	}
}
