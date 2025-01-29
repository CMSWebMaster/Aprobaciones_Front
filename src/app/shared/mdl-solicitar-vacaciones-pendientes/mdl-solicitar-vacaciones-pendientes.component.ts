import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IPeriodo } from 'src/app/pages/approval/models/vacaciones/periodo.interface';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import { VacacionesTomadasService } from 'src/app/pages/approval/services/vacaciones-tomadas.service';
import { firstValueFrom } from 'rxjs';
import { JefeResponsableService } from 'src/app/pages/approval/services/jefe-responsable.service';
import { IResponseJefeResponsable } from 'src/app/interfaces/jefe-responsable/response-jefe-responsable.interface';
import { MdlBuscarJefeResponsableComponent } from '../mdl-buscar-jefe-responsable/mdl-buscar-jefe-responsable.component';

export interface IFrmMdlSolVacPend {
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-mdl-solicitar-vacaciones-pendientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mdl-solicitar-vacaciones-pendientes.component.html',
  styleUrl: './mdl-solicitar-vacaciones-pendientes.component.scss'
})
export class MdlSolicitarVacacionesPendientesComponent implements OnInit {
  public filtros: IFrmMdlSolVacPend = {
    fechaInicio: null,
    fechaFin: null,
  };

  public diferenciaDias: number = -1;
  public codigoUsuario: string = '';
  public jefesResponsables: Array<IResponseJefeResponsable> = [];
  public jefeResponsableSel: IResponseJefeResponsable = null;

  public fSolicitandoVacaciones = false;

  @Input({ required: true })
  public periodo: IPeriodo;

  @Input({ required: true })
  readonly confianza: number;

  constructor (
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private vacacionesTomadasService: VacacionesTomadasService,
    private jefeResponsableService: JefeResponsableService,
  ) {}

  ngOnInit(): void {
    this.codigoUsuario = localStorage.getItem('CodigoUsuario');
    this.obtenerDatosJefesResponsable(null, this.codigoUsuario);
  }

  public async obtenerDatosJefesResponsable(nombre: string, codigoUsuario: string): Promise<void> {
    await this.buscarJefesResponsables(nombre, codigoUsuario);
    this.jefeResponsableSel = this.jefesResponsables[0] ?? null;
  }

  public async buscarJefesResponsables(nombre: string, codigoUsuario: string): Promise<void> {
    try {
      this.jefesResponsables = await firstValueFrom(
        this.jefeResponsableService.listarPeriodos(nombre, codigoUsuario)
      );
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al buscar los jefes responsables',
      });
    } finally {
      //
    }
  }

  public cambiarJefeResponsable(): void {
    const modal: NgbModalRef = this.modalService.open(MdlBuscarJefeResponsableComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modal.componentInstance.codigoUsuario = this.codigoUsuario;
    modal.componentInstance.evtJefeResponsable.subscribe((jr: IResponseJefeResponsable) => {
      this.jefeResponsableSel = jr;
    });
  }

  public async solicitarVacaciones(): Promise<void> {
    const error = this.validarFechas();

    if (error) {
      Swal.fire({
        icon: 'error',
        text: error,
      });
      return;
    }

    try {
      this.fSolicitandoVacaciones = true;

      await firstValueFrom(
        this.vacacionesTomadasService.solicitarVacacionesPendientes(
          this.periodo.Empleado,
          this.periodo.NumeroPeriodo,
          this.filtros.fechaInicio,
          this.filtros.fechaFin,
          this.jefeResponsableSel.Persona,
        )
      );

      // const diasVacaciones = (this.diferenciaDias + 1);
      // const diasVacRestantes = (parseInt(this.periodo.Pendientes) - diasVacaciones).toString();

      // this.periodo.Pendientes = diasVacRestantes;
      // this.periodo.DiasGozados = (parseInt(this.periodo.DiasGozados) + diasVacaciones).toString();

      Swal.fire({
        icon: 'info',
        text: 'Tu solicitud de vacaciones se registró exitosamente. Esto no implica una aprobación automática, ya que está sujeta a revisión por tu jefatura inmediata, gerencia y la Gerencia de Talento.',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: error.error.message,
      });
    } finally {
      this.fSolicitandoVacaciones = false;
    }
  }

  // public async solicitarVacaciones(): Promise<void> {
  //   const error = this.validarFechas();

  //   if (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       text: error,
  //     });
  //     return;
  //   }

  //   try {
  //     this.fSolicitandoVacaciones = true;

  //     console.log({
  //       'Empleado': this.periodo.Empleado,
  //       'NumeroPeriodo': this.periodo.NumeroPeriodo,
  //       'fechaInicio': this.filtros.fechaInicio,
  //       'fechaFin': this.filtros.fechaFin,
  //       'codigoUsuario': this.codigoUsuario,
  //     })
  //     await new Promise(resolve => {
  //       setTimeout(() => resolve(0), 1000);
  //     });

  //     // await firstValueFrom(
  //     //   this.vacacionesTomadasService.solicitarVacacionesPendientes(
  //     //     this.periodo.Empleado,
  //     //     this.periodo.NumeroPeriodo,
  //     //     this.filtros.fechaInicio,
  //     //     this.filtros.fechaFin,
  //     //     this.codigoUsuario,
  //     //   )
  //     // );

  //     // const diasVacaciones = (this.diferenciaDias + 1);
  //     // const diasVacRestantes = (parseInt(this.periodo.Pendientes) - diasVacaciones).toString();

  //     // this.periodo.Pendientes = diasVacRestantes;
  //     // this.periodo.DiasGozados = (parseInt(this.periodo.DiasGozados) + diasVacaciones).toString();

  //     Swal.fire({
  //       icon: 'info',
  //       text: 'Tu solicitud de vacaciones se registró exitosamente. Esto no implica una aprobación automática, ya que está sujeta a revisión por tu jefatura inmediata, gerencia y la Gerencia de Talento.',
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       icon: 'error',
  //       text: error.error.message,
  //     });
  //   } finally {
  //     this.fSolicitandoVacaciones = false;
  //   }
  // }

  public aEntero(nro: string): number {
    return parseInt(nro);
  }

  public calcularDiferenciaEnDias(): void {
    if (this.filtros.fechaInicio && this.filtros.fechaFin) {
      const fechaInicio = DateTime.fromISO(this.filtros.fechaInicio);
      const fechaFin = DateTime.fromISO(this.filtros.fechaFin);

      this.diferenciaDias = fechaFin.diff(fechaInicio, 'days').days;
    } else {
      this.diferenciaDias = -1;
    }
  }

  public validarFechas(): string {
    if (!this.filtros.fechaInicio) {
      return 'La fecha de inicio es requerida.';
    }

    if (!this.filtros.fechaFin) {
      return 'La fecha de fin es requerida';
    }

    const fechaInicio = DateTime.fromISO(this.filtros.fechaInicio);
    const fechaFin = DateTime.fromISO(this.filtros.fechaFin);

    if (fechaInicio > fechaFin) {
      return 'La fecha de inicio no puede ser mayor que la fecha de fin.';
    }

    const pendientes = parseInt(this.periodo.Pendientes);
    const pedidos = this.diferenciaDias + 1;

    if (pedidos > pendientes) {
      return 'No se puede solicitar mas días de los pendientes.';
    }

    if (this.confianza == 0 && pendientes >= 7) {
      if (pedidos < 7) {
        return 'Se debe solicitar como mínimo 7 días.';
      }
    }

    return '';
  }

  public infoDiasSolicitar(): number {
    const dias = this.diferenciaDias + 1;
    return dias > 0 ? dias : 0;
  }

  public cerrar(): void {
    this.modal.close();
  }
}
