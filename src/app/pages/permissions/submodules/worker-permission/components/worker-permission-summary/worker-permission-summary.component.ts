import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IApprovePermission } from 'src/app/pages/permissions/models/IApprovePermission';
import { IWorkerPermission } from 'src/app/pages/permissions/models/IWorkerPermissionDetail';
import { WorkerPermissionService } from 'src/app/pages/permissions/services/worker-permission.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
	user: string;

	@Input() permissionDetail: IWorkerPermission;
	@Output() onEmitBackPermission: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private workerPermissionService: WorkerPermissionService) {
		this.user = localStorage.getItem('cod_user');
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
			console.log(this.permissionDetail.CodUsuarioAprobador, this.user);
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

	executeRejectPermission() {
		Swal.fire({
			icon: 'question',
			title: 'RECHAZAR PERMISO.',
			text: 'Está seguro de RECHAZAR el permiso?',
			showCancelButton: true,
			showConfirmButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				this.workerPermissionService.executeRejectPermission(this.permissionApprove).subscribe({
					next: (response) => {
						Swal.fire({
							icon: 'success',
							title: 'RECHAZADO!',
							text: 'El permiso fue RECHAZADO con éxito.',
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

	generatePdf() {
		const doc = new jsPDF('p', 'mm', 'a4');

		// Variables dinámicas
		const colaborador = this.permissionDetail.Colaborador || '';
		const departamento = this.permissionDetail.Area || '';
		const justificacion = this.permissionDetail.Justificacion || '';
		const colaboradorCodigo = this.permissionDetail.IdColaborador.toString() || '';
		const autorizadoParaSalir = this.permissionDetail.MotivoCodigo == 1 ? true : false;
		const autorizadoParaNoAsistir = this.permissionDetail.MotivoCodigo == 2 ? true : false;;
		const fecDesde = new Date(this.permissionDetail.FechaDesde);
		const fecHasta = new Date(this.permissionDetail.FechaHasta);

		console.log(this.permissionDetail.FechaDesde, autorizadoParaSalir, autorizadoParaNoAsistir)

		const fecDesdeSplit = this.permissionDetail.FechaDesde.split(' ');
		const fechaDesde = fecDesdeSplit[0];
		const horaDesde = fecDesdeSplit[1];
		const fecHastaSplit = this.permissionDetail.FechaHasta.split(' ');
		const fechaHasta = fecHastaSplit[0];
		const horaHasta = fecHastaSplit[1];

		// Primera sección (primer cargo)

		// Ubicación dinámica
		const location = this.permissionDetail.SedeCodigo || '';
		const locationText = `Lima (${location === '0001' ? 'X' : ' '}) Chorrillos (${location === '0002' ? 'X' : ' '}) Surco (${location === '0004' ? 'X' : ' '})`;

		// Primera sección (primer cargo)

		// Encabezado con logo y texto
		doc.setFontSize(8);
		doc.text(locationText, 150, 10)

		// Título
		doc.setFontSize(12);
		doc.text('CONTROL DE PERMISOS DEL PERSONAL', 105, 20, { align: 'center' });

		// Datos del empleado
		doc.setFontSize(8);
		doc.text(colaboradorCodigo, 10, 30);
		doc.text(colaborador, 40, 30);
		doc.text('Código', 10, 34);
		doc.text('Apellidos y Nombres', 40, 34);
		doc.text(departamento, 130, 30);
		doc.text('Departamento', 140, 34);

		// Dibujar cuadros para la información del empleado
		doc.rect(5, 25, 20, 10); // Código
		doc.rect(25, 25, 100, 10); // Apellidos y Nombres
		doc.rect(125, 25, 80, 10); // Departamento

		// Autorizado para
		doc.setFontSize(8);
		doc.text('AUTORIZADO PARA:', 10, 45);
		doc.text('SALIR DEL LOCAL', 30, 50);
		doc.text('NO CONCURRIR A SUS LABORES', 30, 55);
		if (autorizadoParaSalir) {
			doc.rect(25, 48, 4, 4, 'F'); // Checkbox filled
		} else {
			doc.rect(25, 48, 4, 4); // Checkbox empty
		}
		if (autorizadoParaNoAsistir) {
			doc.rect(25, 53, 4, 4, 'F'); // Checkbox filled
		} else {
			doc.rect(25, 53, 4, 4); // Checkbox empty
		}

		// Dibujar cuadro para autorizado para
		doc.rect(5, 40, 200, 20);

		// Desde y Hasta
		doc.setFontSize(8);
		doc.text('DESDE:', 10, 65);
		doc.text(fechaDesde.toString(), 30, 65);
		doc.text(horaDesde, 90, 65);
		doc.text('HASTA:', 10, 70);
		doc.text(fechaHasta.toString(), 30, 70);
		doc.text(horaHasta, 90, 70);

		// Dibujar cuadros para fechas y horas
		doc.rect(5, 60, 200, 15);

		// Justificación
		doc.setFontSize(8);
		doc.text('JUSTIFICACIÓN:', 10, 80);
		doc.text(justificacion, 12, 90, { maxWidth: 190 }); // Ajustar el texto dentro del cuadro
		doc.rect(10, 85, 190, 20); // Caja de justificación

		// Dibujar cuadro para justificación
		doc.rect(5, 75, 200, 35);

		// Líneas de firmas
		doc.line(20, 120, 60, 120); // Línea para autorizado por
		doc.line(70, 120, 110, 120); // Línea para firma del trabajador
		doc.line(130, 120, 170, 120); // Línea para recepcionado por C.T.

		// Firmas
		doc.setFontSize(8);
		doc.text('AUTORIZADO POR', 25, 125);
		doc.text('FIRMA DEL TRABAJADOR', 75, 125);
		doc.text('RECEPCIONADO POR C.T.', 135, 125);

		// Dibujar cuadro para firmas
		doc.rect(5, 110, 200, 20);

		// Segunda sección (segundo cargo) - misma estructura

		// Añadir espacio adicional
		const additionalSpace = 10;

		// Primera sección (primer cargo)

		// Encabezado con logo y texto
		doc.setFontSize(8);
		doc.text(locationText, 150, 145 + additionalSpace)

		// Título
		doc.setFontSize(12);
		doc.text('CONTROL DE PERMISOS DEL PERSONAL', 105, 155 + additionalSpace, { align: 'center' });

		// Datos del empleado
		doc.setFontSize(8);
		doc.text(colaboradorCodigo, 10, 165 + additionalSpace);
		doc.text(colaborador, 40, 165 + additionalSpace);
		doc.text('Código', 10, 169 + additionalSpace);
		doc.text('Apellidos y Nombres', 40, 169 + additionalSpace);
		doc.text(departamento, 130, 165 + additionalSpace);
		doc.text('Departamento', 140, 169 + additionalSpace);

		// Dibujar cuadros para la información del empleado
		doc.rect(5, 160 + additionalSpace, 20, 10); // Código
		doc.rect(25, 160 + additionalSpace, 100, 10); // Apellidos y Nombres
		doc.rect(125, 160 + additionalSpace, 80, 10); // Departamento

		// Autorizado para
		doc.setFontSize(8);
		doc.text('AUTORIZADO PARA:', 10, 180 + additionalSpace);
		doc.text('SALIR DEL LOCAL', 30, 185 + additionalSpace);
		doc.text('NO CONCURRIR A SUS LABORES', 30, 190 + additionalSpace);
		if (autorizadoParaSalir) {
			doc.rect(25, 183 + additionalSpace, 4, 4, 'F'); // Checkbox filled
		} else {
			doc.rect(25, 183 + additionalSpace, 4, 4); // Checkbox empty
		}
		if (autorizadoParaNoAsistir) {
			doc.rect(25, 188 + additionalSpace, 4, 4, 'F'); // Checkbox filled
		} else {
			doc.rect(25, 188 + additionalSpace, 4, 4); // Checkbox empty
		}

		// Dibujar cuadro para autorizado para
		doc.rect(5, 175 + additionalSpace, 200, 20);

		// Desde y Hasta
		doc.setFontSize(8);
		doc.text('DESDE:', 10, 200 + additionalSpace);
		doc.text(fechaDesde, 30, 200 + additionalSpace);
		doc.text(horaDesde, 90, 200 + additionalSpace);
		doc.text('HASTA:', 10, 205 + additionalSpace);
		doc.text(fechaDesde, 30, 205 + additionalSpace);
		doc.text(horaDesde, 90, 205 + additionalSpace);

		// Dibujar cuadros para fechas y horas
		doc.rect(5, 195 + additionalSpace, 200, 15);

		// Justificación	
		doc.setFontSize(8);
		doc.text('JUSTIFICACIÓN:', 10, 215 + additionalSpace);
		doc.text(justificacion, 12, 225 + additionalSpace, { maxWidth: 190 }); // Ajustar el texto dentro del cuadro
		doc.rect(10, 220 + additionalSpace, 190, 20); // Caja de justificación

		// Dibujar cuadro para justificación
		doc.rect(5, 210 + additionalSpace, 200, 35);

		// Líneas de firmas
		doc.line(20, 255 + additionalSpace, 60, 255 + additionalSpace); // Línea para autorizado por
		doc.line(70, 255 + additionalSpace, 110, 255 + additionalSpace); // Línea para firma del trabajador
		doc.line(130, 255 + additionalSpace, 170, 255 + additionalSpace); // Línea para recepcionado por C.T.

		// Firmas
		doc.setFontSize(8);
		doc.text('AUTORIZADO POR', 25, 260 + additionalSpace);
		doc.text('FIRMA DEL TRABAJADOR', 75, 260 + additionalSpace);
		doc.text('RECEPCIONADO POR C.T.', 135, 260 + additionalSpace);

		// Dibujar cuadro para firmas
		doc.rect(5, 245 + additionalSpace, 200, 20);

		// Guardar el PDF
		doc.save('control_permisos.pdf');
	}
}

