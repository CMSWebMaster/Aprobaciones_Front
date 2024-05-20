import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, UntypedFormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { IAddWorkerPermission } from 'src/app/pages/approval/models/IAddWorkerPermission';
import { WorkerPermissionService } from 'src/app/pages/approval/services/worker-permission.service';

@Component({
	selector: 'app-worker-permision-form',
	standalone: true,
	imports: [NgbTimepickerModule, ReactiveFormsModule, FormsModule, JsonPipe, NgbDatepickerModule],
	templateUrl: './worker-permision-form.component.html',
	styleUrl: './worker-permision-form.component.scss'
})
export class WorkerPermisionFormComponent {
	time = { hour: 13, minute: 30 };
	addWorkerPermissionForm: UntypedFormGroup;
	sede: string = '';
	area: string = '';
	user: number;

	@Output() onEmitCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() onEmitFinalizeAddPermission: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(public fb: FormBuilder, public workerPermissionService: WorkerPermissionService) {
		this.addWorkerPermissionForm = this.fb.group({
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

	closeModal() {
		this.onEmitCloseModal.emit();
	}

	onSubmit() {
		const startHour = this.addWorkerPermissionForm?.get('startTime')?.value;
		const endHour = this.addWorkerPermissionForm?.get('endTime')?.value
		const request: IAddWorkerPermission = {
			IdColaborador: this.user,
			IdArea: this.area,
			CodSede: this.sede,
			CodMotivo: '123',
			FechaDesde: this.addWorkerPermissionForm?.get('startDate')?.value,
			FechaHasta: this.addWorkerPermissionForm?.get('endDate')?.value,
			HoraDesde: `${startHour.hour}:${startHour.minute}`,
			HoraHasta: `${endHour.hour}:${endHour.minute}`,
			Justificacion: this.addWorkerPermissionForm?.get('justification')?.value,
			CodUserRegistro: this.user,
			IndicadorEstado: 'SO'
		}
		console.log(request);
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
}
