import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
	rowsInit: any = [];
	@Input() showDetails: boolean = true;
	@Output() onEmitViewDetails: EventEmitter<any> = new EventEmitter<any>();
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();
	_searchTerm: string = '';
	pageSize: number = 6;
	isLargeScreen: boolean;

	constructor() {
		this.isLargeScreen = window.innerWidth > 768;
	}

	ngOnChanges(changes: any) {
		if (changes.rows && this.rows) {
			this.rowsInit = this.rows;
		}
	}

	get searchTerm(): string {
		return this._searchTerm;
	}
	set searchTerm(val: string) {
		this._searchTerm = val;
		const filterClient = this.filter(val);
		this.rows = [...filterClient];
	}
	onActivate(event) {
		if (event.type === 'click') {
			this.onEmitCellClicked.emit(event.row);
		}
	}
	filter(searchString: string): any[] {
		if (!searchString) {
			return this.rows;
		}

		return this.rowsInit.filter(row => {
			return Object.values(row).some(value =>
				String(value).toLowerCase().includes(searchString.toLowerCase())
			);
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.isLargeScreen = window.innerWidth > 768;
	}
}
