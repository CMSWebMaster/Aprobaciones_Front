import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkerPermissionTableComponent } from '../components/worker-permission-table/worker-permission-table.component';
import { WorkerPermisionFormComponent } from '../components/worker-permision-form/worker-permision-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkerPermissionService } from '../../../services/worker-permission.service';
import { IWorkerPermission } from '../../../../permissions/models/IWorkerPermissionDetail';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkerPermissionSummaryComponent } from '../components/worker-permission-summary/worker-permission-summary.component';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [WorkerPermissionTableComponent, WorkerPermisionFormComponent, WorkerPermissionSummaryComponent, CommonModule, FormsModule],
	templateUrl: './index.component.html',
	styleUrl: './index.component.scss'
})
export class WorkerPermissionComponent implements OnInit {

	@ViewChild('addWorkerPermission', { static: true }) addWorkerPermissionTemplate: TemplateRef<any>;
	private modalRef: any;
	codUser: number = 0;
	rows: any[] = [];
	permissionDetail: IWorkerPermission;
	showDetail: boolean = false;
	user: number;


	constructor(private modalService: NgbModal, private workerPermissionService: WorkerPermissionService) {
		this.user = parseInt(localStorage.getItem('cod_user'));
	}

	ngOnInit(): void {
		this.listWorkerPermission();
	}

	openCreateWorkerPermission() {
		this.modalRef = this.modalService.open(this.addWorkerPermissionTemplate, {
			centered: true,
			backdrop: 'static',
			size: 'md'
		});
	}

	closeModal(e: boolean) {
		this.modalRef.close();
	}

	createWorkerPermission() {
		this.openCreateWorkerPermission();
	}

	listWorkerPermission() {
		this.workerPermissionService.listWorkerPermission(this.user).subscribe({
			next: (response) => {
				console.log(response);
				this.rows = response;
			},
			error: (error) => {
				console.log(error);
				this.rows = [];
			}
		});
	}

	finalizeAddPermission() {
		this.listWorkerPermission();
	}

	cellClicked(e: IWorkerPermission) {
		console.log(e);
		this.showDetail = true;
		this.permissionDetail = e;
	}

	backToTablePermission() {
		this.listWorkerPermission();
		this.showDetail = false;
	}
}
