import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableComponent } from 'src/app/commom/shared-components/table/table.component';
import { IApprovalRequeriments } from 'src/app/pages/approval/models/IApprovalRequeriments';
import { IFilesRequirement } from 'src/app/pages/approval/models/IFilesRequirement';
import { IRequirementDetail } from 'src/app/pages/approval/models/IRequierementDetail';
import { RequirementsService } from 'src/app/pages/approval/services/requirements.service';

@Component({
	selector: 'app-requirements-table',
	standalone: true,
	imports: [TableComponent],
	templateUrl: './requirements-table.component.html',
	styleUrl: './requirements-table.component.scss'
})
export class RequirementsTableComponent {
	columns = [{ name: 'Fecha Preparacion', prop: 'FechaPreparacion' }, { name: 'Prioridad', prop: 'Prioridad' }, { name: 'Centro Costos', prop: 'CCostos' }, { name: 'Preparada Por', prop: 'PreparadaPor' },];
	@Input() rows: any = [];
	@Output() onEmmitRequierementsDetails: EventEmitter<any> = new EventEmitter<any>();

	constructor(private requirementsService: RequirementsService) { }

	cellClicked(e: IApprovalRequeriments) {
		this.getRequirementsDetails(e);
	}

	getRequirementsDetails(row: IApprovalRequeriments) {
		this.requirementsService.getRequierementDetail(row.RequisicionNumero).subscribe({
			next: (response) => {
				this.getFilesRequirement(row, response);
			},
			error: (error) => {
				console.log(error);
				this.onEmmitRequierementsDetails.emit([]);
			}
		});
	}

	getFilesRequirement(row: IApprovalRequeriments, listDetails: IRequirementDetail[]) {
		this.requirementsService.getFilesRequirement('0000036177').subscribe({
			next: (response) => {
				this.onEmmitRequierementsDetails.emit({
					details: listDetails,
					rowSelected: row,
					files: response
				});
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}