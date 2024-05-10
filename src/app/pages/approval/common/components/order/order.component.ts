import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApprovalService } from '../../services/approval.service';

@Component({
	selector: 'app-order',
	standalone: true,
	imports: [NgxDatatableModule, CommonModule, FormsModule],
	templateUrl: './order.component.html',
	styleUrl: './order.component.scss'
})
export class OrderComponent {

	columns = [{ prop: 'Compromiso', name: 'Compromiso' }, { name: 'Descripción', prop: 'DescripcionLocal' }, { name: 'Nombre', prop: 'Nombre' }];
	@Input() rows: any = [];
	@Input() showDetails: boolean = true;
	@Output() onEmitViewDetails: EventEmitter<any> = new EventEmitter<any>();
	_searchTerm: string = '';
	pageSize: number = 6;

	get searchTerm(): string {
		return this._searchTerm;
	}
	set searchTerm(val: string) {
		this._searchTerm = val;
		const filterClient = this.filter(val);
		console.log(filterClient);
		this.rows = [...filterClient];
	}

	constructor(private approvalService: ApprovalService) {

	}

	onActivate(event) {
		if (event.type === 'click') {
			console.log('Clicked Row:', event.row);
			this.getUsersApprovers(event.row);
		}
	}

	filter(v: string) {
		return this.rows
			.filter(
				(x) =>
					x.Compromiso?.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
					x.DescripcionLocal?.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
					x.Nombre?.toLowerCase().indexOf(v.toLowerCase()) !== -1
			);
	}

	getUsersApprovers(row: any) {
		console.log(row);
		this.approvalService.getUsersApprovers(row.NumeroOrden ?? row.NumeroCompromiso, row.NumeroOrden ? 'OC' : 'OS').subscribe({
			next: (response) => {
				console.log(response);
				this.onEmitViewDetails.emit({
					row: row,
					userApprovers: response
				});
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
