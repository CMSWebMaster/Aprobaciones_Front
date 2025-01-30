import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IVacacionSolicitada } from '../../models/vacaciones/response-vacacion-solicitada.interface';
import { VacacionesTomadasService } from '../../services/vacaciones-tomadas.service';
import { firstValueFrom } from 'rxjs';
import { EstadoVacacionSolicitadaEnum } from 'src/app/enums/vacacion/estado-vacacion-solicitada.enum';
import { NgClass } from '@angular/common';
import { IRequestRechazarVacacion } from 'src/app/interfaces/vacacion/request-rechazar-vacacion.interface';
import { IRequestAprobarVacacionXJefe } from 'src/app/interfaces/vacacion/request-aprobar-vacacion-x-jefe.interface';
import { IRequestRegistrarVacacionXRRHH } from 'src/app/interfaces/vacacion/request-registrar-vacacion-x-rrhh.interface copy';

@Component({
  selector: 'app-pagina-aprobacion-vacaciones',
  standalone: true,
  imports: [NgClass],
  templateUrl: './pagina-aprobacion-vacaciones.component.html',
  styleUrl: './pagina-aprobacion-vacaciones.component.scss'
})
export class PaginaAprobacionVacacionesComponent implements OnInit {
  private vacacionesTomadasService = inject(VacacionesTomadasService);

  private idPersona = '';
  private roles = '';
  public vacacionesSolicitadas: Array<IVacacionSolicitada> = [];
  public vacacionEnProcesoRechazo: IVacacionSolicitada = null;
  public vacacionEnProcesoCambioEstado: IVacacionSolicitada = null;
  public estadoVacacionSolicitadaEnum = EstadoVacacionSolicitadaEnum;

  public isRRHH = false;
  public fListandoVacacionesSolicitadas = false;
  public fCambiandoEstado = false;
  public fRechazando = false;

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    this.roles = localStorage.getItem('nomRol');
    this.isRRHH = this.roles.includes('RRHH');

    this.listarVacacionesXTipoRol();
  }

  public async listarVacacionesXTipoRol(): Promise<void> {
    if (this.isRRHH) {
      this.listarVacacionesAprobadas();
    } else {
      this.listarVacacionesSolicitadasXAprobar();
    }
  }

  public async listarVacacionesSolicitadasXAprobar(): Promise<void> {
    try {
      this.fListandoVacacionesSolicitadas = true;
      this.vacacionesSolicitadas = await firstValueFrom(
        this.vacacionesTomadasService.listarVacacionesSolicitadasXAprobar(this.idPersona)
      );
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar las vacaciones solicitadas.'
      });
    } finally {
      this.fListandoVacacionesSolicitadas = false;
    }
  }

  public async listarVacacionesAprobadas(): Promise<void> {
    try {
      this.fListandoVacacionesSolicitadas = true;
      this.vacacionesSolicitadas = await firstValueFrom(
        this.vacacionesTomadasService.listarVacacionesAprobadasXRegistrar()
      );
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar las vacaciones aprobadas.'
      });
    } finally {
      this.fListandoVacacionesSolicitadas = false;
    }
  }

  public async cambiarEstado(vacacion: IVacacionSolicitada): Promise<void> {
    if (this.isRRHH) {
      this.registrarAprobado(vacacion);
    } else {
      this.aprobarParaRegistro(vacacion);
    }
  }

  public async aprobarParaRegistro(vacacion: IVacacionSolicitada): Promise<void> {
    try {
      this.fCambiandoEstado = true;
      this.vacacionEnProcesoCambioEstado = vacacion;

      const parametros: IRequestAprobarVacacionXJefe = {
        idPeriodo: vacacion.idPeriodo,
        idPersona: vacacion.idPersona,
        fechaInicio: vacacion.fechaInicio,
        fechaFin: vacacion.fechaFin,
      };

      await firstValueFrom(this.vacacionesTomadasService.aprobarVacacion(parametros));

      this.cambiarEstadoVacacion(vacacion, EstadoVacacionSolicitadaEnum.APROBADO);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error en la aprobación',
      });
    } finally {
      this.fCambiandoEstado = false;
      this.vacacionEnProcesoCambioEstado = null;
    }
  }

  public async registrarAprobado(vacacion: IVacacionSolicitada): Promise<void> {
    try {
      this.fCambiandoEstado = true;
      this.vacacionEnProcesoCambioEstado = vacacion;

      const parametros: IRequestRegistrarVacacionXRRHH = {
        idPeriodo: vacacion.idPeriodo,
        idPersona: vacacion.idPersona,
        fechaInicio: vacacion.fechaInicio,
        fechaFin: vacacion.fechaFin,
        idResponsableRegistrar: this.idPersona,
      };

      await firstValueFrom(this.vacacionesTomadasService.aprobarVacacionRegistrada(parametros));

      this.cambiarEstadoVacacion(vacacion, EstadoVacacionSolicitadaEnum.REGISTRADO);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error en el registro de la vacación aprobada',
      });
    } finally {
      this.fCambiandoEstado = false;
      this.vacacionEnProcesoCambioEstado = null;
    }
  }

  public async rechazarPendienteAprobacion(vacacion: IVacacionSolicitada): Promise<void> {
    if (!this.isRRHH) {
      try {
        this.fRechazando = true;
        this.vacacionEnProcesoRechazo = vacacion;

        const parametros: IRequestRechazarVacacion = {
          idPeriodo: vacacion.idPeriodo,
          idPersona: vacacion.idPersona,
          fechaInicio: vacacion.fechaInicio,
          fechaFin: vacacion.fechaFin,
          rechazoPersona: this.idPersona,
        };

        await firstValueFrom(this.vacacionesTomadasService.rechazarVacacion(parametros));

        this.cambiarEstadoVacacion(vacacion, EstadoVacacionSolicitadaEnum.RECHAZADO);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error al rechazar la vación pendiente.',
        });
      } finally {
        this.fRechazando = false;
        this.vacacionEnProcesoRechazo = null;
      }
    }
  }

  private cambiarEstadoVacacion(vacacion: IVacacionSolicitada, estado: EstadoVacacionSolicitadaEnum): void {
    this.vacacionesSolicitadas = this.vacacionesSolicitadas.map(vac => {
      if (
        vac.idPeriodo == vacacion.idPeriodo &&
        vac.idPersona == vacacion.idPersona &&
        vac.fechaInicio == vacacion.fechaInicio &&
        vac.fechaFin == vacacion.fechaFin
      ) {
        vac.estado = estado;
      }
      return vac;
    });
  }

  public enProcesoCambioEstado(vacacion: IVacacionSolicitada): boolean {
    return this.fCambiandoEstado && (
        this.vacacionEnProcesoCambioEstado.idPeriodo == vacacion.idPeriodo &&
        this.vacacionEnProcesoCambioEstado.idPersona == vacacion.idPersona &&
        this.vacacionEnProcesoCambioEstado.fechaInicio == vacacion.fechaInicio &&
        this.vacacionEnProcesoCambioEstado.fechaFin == vacacion.fechaFin
      );
  }

  public enProcesoRechazo(vacacion: IVacacionSolicitada): boolean {
    return this.fRechazando && (
        this.vacacionEnProcesoRechazo.idPeriodo == vacacion.idPeriodo &&
        this.vacacionEnProcesoRechazo.idPersona == vacacion.idPersona &&
        this.vacacionEnProcesoRechazo.fechaInicio == vacacion.fechaInicio &&
        this.vacacionEnProcesoRechazo.fechaFin == vacacion.fechaFin
      );
  }

  public colorFondo(estado: string): object {
    return {
      'bg-success': EstadoVacacionSolicitadaEnum.APROBADO == estado,
      'bg-primary': EstadoVacacionSolicitadaEnum.PENDIENTE == estado,
      'bg-danger': EstadoVacacionSolicitadaEnum.RECHAZADO == estado,
      'bg-dark': EstadoVacacionSolicitadaEnum.ANULADO == estado,
      'bg-secondary': EstadoVacacionSolicitadaEnum.REGISTRADO == estado,
    };
  }

  public estadoATxt(estado: string): string {
    if (EstadoVacacionSolicitadaEnum.APROBADO == estado) {
      return 'APROBADO';
    }
    if (EstadoVacacionSolicitadaEnum.PENDIENTE == estado) {
      return 'PENDIENTE';
    }
    if (EstadoVacacionSolicitadaEnum.RECHAZADO == estado) {
      return 'RECHAZADO';
    }
    if (EstadoVacacionSolicitadaEnum.REGISTRADO == estado) {
      return 'REGISTRADO';
    }
    if (EstadoVacacionSolicitadaEnum.ANULADO  == estado) {
      return 'ANULADO ';
    }
    return '';
  }

  public txtBtnCambiarEstado(): string {
    return this.isRRHH
      ? 'Aprobar'
      : 'Aprobar';
  }

  public desactivarBtnAprobar(vacacion: IVacacionSolicitada): boolean {
    if (this.isRRHH) {
      return vacacion.estado !== EstadoVacacionSolicitadaEnum.APROBADO ||
        this.fCambiandoEstado ||
        this.fRechazando;
    } else {
      return vacacion.estado !== EstadoVacacionSolicitadaEnum.PENDIENTE ||
        this.fCambiandoEstado ||
        this.fRechazando;
    }
  }
}
