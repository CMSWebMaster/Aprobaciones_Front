import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';
import { IApprovalRequeriments } from 'src/app/pages/approval/models/IApprovalRequeriments';
import { IRequirementDetail } from 'src/app/pages/approval/models/IRequierementDetail';
import { RequirementsFilesComponent } from '../requirements-files/requirements-files.component';
import { IFilesRequirement } from 'src/app/pages/approval/models/IFilesRequirement';
import { RequirementsService } from 'src/app/pages/approval/services/requirements.service';
import Swal from 'sweetalert2';
import { IExecuteRequirements } from 'src/app/pages/approval/models/IExecuteRequirements';
import { TableResizeComponent } from 'src/app/commom/shared-components/table-resize/table-resize.component';

@Component({
	selector: 'app-requirements-summary',
	standalone: true,
	imports: [TableComponent, RequirementsFilesComponent, TableResizeComponent],
	templateUrl: './requirements-summary.component.html',
	styleUrl: './requirements-summary.component.scss'
})
export class RequirementsSummaryComponent {

	requirementDetail: IRequirementDetail;
	columns = [{ prop: 'Secuencia', name: 'Secuencia' }, { name: 'Descripción', prop: 'Descripcion' }, { name: 'Laboratorio', prop: 'Laboratorio' },
	{ name: 'Unidad Código', prop: 'UnidadCodigo' }, { name: 'Cantidad Pedidad', prop: 'CantidadPedida' }];
	showFiles: boolean = false;
	requestApprove: IExecuteRequirements;
	persona: string = '';
	tableDetails: any = [];

	@Input() rows: IRequirementDetail[] = [];
	@Input() rowSelected: IApprovalRequeriments;
	@Input() filesRequirement: IFilesRequirement[];
	@Output() onEmitBackToTableReq: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private requirementsService: RequirementsService) {
		this.persona = localStorage.getItem('CodigoUsuario');
	}

	ngOnChanges(changes: any) {
		if (changes.rowSelected && this.rowSelected) {
			this.requestApprove = {
				CodigoRequerimiento: this.rowSelected.RequisicionNumero,
				CodigoUsuario: this.persona,
				CompaniaSocio: '01000000'
			}
		}
		if (changes.rows && this.rows) {
			this.tableDetails = this.rows.map(row => {
				return {
					...row,
					Cabecera: row.Descripcion,
					Detalle1: row.UnidadCodigo,
					Detalle2: row.CantidadPedida
				};
			});
		}
		console.log(this.tableDetails)
	}

	backToRequirementTable() {
		this.onEmitBackToTableReq.emit();
	}

	viewFiles(viewFiles: boolean) {
		this.showFiles = viewFiles;
	}

	approveRequirements() {
		Swal.fire({
			icon: 'question',
			title: 'APROBAR REQUERIMIENTO.',
			text: 'Está seguro de APROBAR el requerimiento?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.requirementsService.executeApproveRequirement(this.requestApprove).subscribe({
					next: (response) => {
						Swal.fire({
							icon: 'success',
							title: 'APROBADO!',
							text: 'El requerimiento fue APROBADO con éxito.',
						});
						this.onEmitBackToTableReq.emit();
					},
					error: (error) => {
						console.log(error);
					}
				});
			}
		});
	}

	rejectRequirements() {
		Swal.fire({
			icon: 'question',
			title: 'RECHAZAR REQUERIMIENTO.',
			text: 'Está seguro de RECHAZAR el requerimiento?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.requirementsService.executeRejectRequirement(this.requestApprove).subscribe({
					next: (response) => {
						Swal.fire({
							icon: 'success',
							title: 'RECHAZADO!',
							text: 'El requerimiento fue RECHAZADO con éxito.',
						});
						this.onEmitBackToTableReq.emit();
					},
					error: (error) => {
						console.log(error);
					}
				});
			}
		});
	}
}
