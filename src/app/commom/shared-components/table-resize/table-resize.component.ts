import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITableResize } from '../../models/ITableResize';

@Component({
	selector: 'app-table-resize',
	standalone: true,
	imports: [],
	templateUrl: './table-resize.component.html',
	styleUrl: './table-resize.component.scss'
})
export class TableResizeComponent {

	@Input() tableDetails: any = [];
	@Output() onEmitCellClicked: EventEmitter<any> = new EventEmitter<any>();

	viewDetails(row: any) {
		this.onEmitCellClicked.emit(row);
	}
}
