import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [NgxDatatableModule, CommonModule, FormsModule],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class TableComponent {

	@Input() columns = [];
	@Input() rows: any = [];
	@Input() showDetails: boolean = true;
	@Output() onEmitViewDetails: EventEmitter<any> = new EventEmitter<any>();
	@Output() onEmitCreateWorkerPermission: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();
	_searchTerm: string = '';
	pageSize: number = 6;

	get searchTerm(): string {
		return this._searchTerm;
	}
	set searchTerm(val: string) {
		// this._searchTerm = val;
		// const filterClient = this.filter(val);
		// console.log(filterClient);
		// this.rows = [...filterClient];
	}
	onActivate(event) {
		if (event.type === 'click') {
			console.log('Clicked Row:', event.row);
			// this.getUsersApprovers(event.row);
			this.onEmitCellClicked.emit(event.row);
		}
	}
}
