import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-table-resize',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './table-resize.component.html',
	styleUrl: './table-resize.component.scss'
})
export class TableResizeComponent {

	@Input() tableDetails: any = [];
	tableDetailsInit: any = [];
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();
	_searchTerm: string = '';

	ngOnChanges(changes: any) {
		if (changes.tableDetails && this.tableDetails) {
			this.tableDetailsInit = this.tableDetails;
		}
	}

	viewDetails(row: any) {
		this.onEmitCellClicked.emit(row);
	}
	get searchTerm(): string {
		return this._searchTerm;
	}
	set searchTerm(val: string) {
		console.log(val);
		this._searchTerm = val;
		const filterClient = this.filter(val);
		this.tableDetails = [...filterClient];
	}
	filter(searchString: string): any[] {
		if (!searchString) {
			return this.tableDetails;
		}

		return this.tableDetailsInit.filter(row => {
			return Object.values(row).some(value =>
				String(value).toLowerCase().includes(searchString.toLowerCase())
			);
		});
	}
}
