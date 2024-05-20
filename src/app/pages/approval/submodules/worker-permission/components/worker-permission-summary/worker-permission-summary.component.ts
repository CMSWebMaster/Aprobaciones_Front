import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IUsersAprrovers } from 'src/app/pages/approval/models/IUsersApprovers';
import { IWorkerPermission } from 'src/app/pages/approval/models/IWorkerPermissionDetail';

@Component({
	selector: 'app-worker-permission-summary',
	standalone: true,
	imports: [NgbPopover],
	templateUrl: './worker-permission-summary.component.html',
	styleUrl: './worker-permission-summary.component.scss'
})
export class WorkerPermissionSummaryComponent {

	@Input() permissionDetail: IWorkerPermission;
	@Output() onEmitBackPermission: EventEmitter<boolean> = new EventEmitter<boolean>();
	pathIconUser: string = '';
	userApprovers: IUsersAprrovers[] = [];

	backWorkerPermission() {
		this.onEmitBackPermission.emit();
	}

	ngOnChanges(changes: any) {
		console.log(changes);
		if (changes.permissionDetail && this.permissionDetail) {
			this.pathIconUser = this.permissionDetail.SexoColaborador === 'M' ? 'assets/images/users/user5.jpg' : '/assets/images/users/user1.jpg';
		}
	}

	executeApprovalPermission() {

	}
}
