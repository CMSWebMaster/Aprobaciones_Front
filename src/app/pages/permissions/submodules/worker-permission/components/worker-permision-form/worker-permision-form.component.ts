import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, UntypedFormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { IAddWorkerPermission } from 'src/app/pages/permissions/models/IAddWorkerPermission';
import { IPerson } from 'src/app/pages/permissions/models/IPerson';
import { WorkerPermissionService } from 'src/app/pages/permissions/services/worker-permission.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-worker-permision-form',
	standalone: true,
	imports: [NgbTimepickerModule, ReactiveFormsModule, FormsModule, JsonPipe, NgbDatepickerModule, NgSelectModule],
	templateUrl: './worker-permision-form.component.html',
	styleUrl: './worker-permision-form.component.scss'
})
export class WorkerPermisionFormComponent {
	time = { hour: 13, minute: 30 };
	addWorkerPermissionForm: UntypedFormGroup;
	sede: string = '';
	area: string = '';
	user: number;
	approverList: IPerson[] = [];
	personList: IPerson[] = [];
	motiveList: any = [{ id: 1, name: 'Permiso para fuera de local' }, { id: 2, name: 'Permiso para no concurrir a sus labores' }];
	personSearch: string = '';

	@Output() onEmitCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitFinalizeAddPermission: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(public fb: FormBuilder, public workerPermissionService: WorkerPermissionService) {
		this.addWorkerPermissionForm = this.fb.group({
			person: [null, Validators.required],
			approver: [null, Validators.required],
			motive: [null, Validators.required],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			startTime: ['', Validators.required],
			endTime: ['', Validators.required],
			justification: [''],
		});

		this.sede = localStorage.getItem('sede');
		this.area = localStorage.getItem('id_area');
		this.user = parseInt(localStorage.getItem('cod_user'));
	}

	ngOnInit() {
		this.listApprovers();
	}

	closeModal() {
		this.onEmitCloseModal.emit();
	}

	onSubmit() {
		const startHour = this.addWorkerPermissionForm?.get('startTime')?.value;
		const endHour = this.addWorkerPermissionForm?.get('endTime')?.value
		const request: IAddWorkerPermission = {
			IdColaborador: this.addWorkerPermissionForm?.get('person')?.value,
			IdArea: this.area,
			CodSede: this.sede,
			CodMotivo: this.addWorkerPermissionForm?.get('motive')?.value,
			FechaDesde: this.addWorkerPermissionForm?.get('startDate')?.value + ' ' + `${startHour.hour}:${startHour.minute}`,
			FechaHasta: this.addWorkerPermissionForm?.get('endDate')?.value + ' ' + `${endHour.hour}:${endHour.minute}`,
			Justificacion: this.addWorkerPermissionForm?.get('justification')?.value,
			CodUserRegistro: this.user,
			IndicadorEstado: 'RG',
			CodUsuarioAut: this.addWorkerPermissionForm?.get('approver')?.value
		}
		console.log(JSON.stringify(request));
		this.workerPermissionService.addWorkerPermission(request).subscribe({
			next: (response) => {
				console.log(response);
				this.onEmitFinalizeAddPermission.emit();
				this.closeModal();
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	listApprovers() {
		this.workerPermissionService.listApprovers().subscribe({
			next: (response) => {
				this.approverList = response;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

	onSearch(e: any) {
		console.log(e);
		this.personSearch = e.term;
	}

	searchPersons() {
		this.workerPermissionService.searchWorkers(this.personSearch).subscribe({
			next: (response) => {
				this.personList = response;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
