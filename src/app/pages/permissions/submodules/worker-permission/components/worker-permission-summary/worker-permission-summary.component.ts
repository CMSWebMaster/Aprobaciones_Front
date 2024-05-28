import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IUsersAprrovers } from 'src/app/pages/approval/models/IUsersApprovers';
import { IApprovePermission } from 'src/app/pages/permissions/models/IApprovePermission';
import { IWorkerPermission } from 'src/app/pages/permissions/models/IWorkerPermissionDetail';
import { WorkerPermissionService } from 'src/app/pages/permissions/services/worker-permission.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-worker-permission-summary',
	standalone: true,
	imports: [NgbPopover, CommonModule],
	templateUrl: './worker-permission-summary.component.html',
	styleUrl: './worker-permission-summary.component.scss'
})
export class WorkerPermissionSummaryComponent {

	pathIconUser: string = '';
	permissionApprove: IApprovePermission;
	user: number;

	@Input() permissionDetail: IWorkerPermission;
	@Output() onEmitBackPermission: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private workerPermissionService: WorkerPermissionService) {
		this.user = parseInt(localStorage.getItem('cod_user'));
	}

	backWorkerPermission() {
		this.onEmitBackPermission.emit();
	}

	ngOnChanges(changes: any) {
		console.log(changes);
		if (changes.permissionDetail && this.permissionDetail) {
			this.pathIconUser = this.permissionDetail.SexoColaborador === 'M' ? 'assets/images/users/user5.jpg' : '/assets/images/users/user1.jpg';

			this.permissionApprove = {
				IdPermiso: this.permissionDetail.IdPermiso,
				IdAprobador: this.user,
			}
		}
	}

	executeApprovalPermission() {
		Swal.fire({
			icon: 'question',
			title: 'APROBAR PERMISO.',
			text: 'Está seguro de APROBAR el permiso?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.workerPermissionService.executeApprovePermission(this.permissionApprove).subscribe({
					next: (response) => {
						Swal.fire({
							icon: 'success',
							title: 'APROBADO!',
							text: 'El permiso fue APROBADO con éxito.',
						});
						this.onEmitBackPermission.emit();
					},
					error: (error) => {
						console.log(error);
					}
				});
			}
		});
	}
}
