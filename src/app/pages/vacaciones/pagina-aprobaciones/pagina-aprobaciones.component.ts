import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { IVacacionSolicitada } from '../../approval/models/vacaciones/response-vacacion-solicitada.interface';
import { VacacionesTomadasService } from '../../approval/services/vacaciones-tomadas.service';
import { EstadoVacacionSolicitadaEnum } from 'src/app/enums/vacacion/estado-vacacion-solicitada.enum';
import { NgClass } from '@angular/common';
import { IRequestAnularVacacion } from 'src/app/interfaces/vacacion/request-anular-vacacion.interface';

@Component({
  selector: 'app-pagina-aprobaciones',
  standalone: true,
  imports: [NgClass],
  templateUrl: './pagina-aprobaciones.component.html',
  styleUrl: './pagina-aprobaciones.component.scss'
})
export class PaginaAprobacionesComponent implements OnInit {
  private vacacionesTomadasService = inject(VacacionesTomadasService);

  public vacacionEnProcesoAnulacion: IVacacionSolicitada = null;
  public vacacionesSolicitadas: Array<IVacacionSolicitada> = [];
  public idPersona = '';

  public fListandoVacacionesSolicitadas = false;
  public fanulandoVacacion = false;

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    // TODO por fines de desarrollo se usa otro id
    // this.idPersona = '75';

    this.listarVacacionesSolicitadas();
  }

  public async listarVacacionesSolicitadas(): Promise<void> {
    try {
      this.fListandoVacacionesSolicitadas = true;
      this.vacacionesSolicitadas = await firstValueFrom(
        this.vacacionesTomadasService.listarVacacionesSolicitadas(this.idPersona)
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

  public async anular(vacacion: IVacacionSolicitada): Promise<void> {
    try {
      this.fanulandoVacacion = true;
      this.vacacionEnProcesoAnulacion = vacacion;

      const parametros: IRequestAnularVacacion = {
        idPeriodo: vacacion.idPeriodo,
        idPersona: vacacion.idPersona,
        fechaInicio: vacacion.fechaInicio,
        fechaFin: vacacion.fechaFin,
      };

      await firstValueFrom(this.vacacionesTomadasService.anularVacacion(parametros));

      this.cambiarEstadoVacacion(vacacion, EstadoVacacionSolicitadaEnum.ANULADO);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al anular la vacación solicitada.'
      });
    } finally {
      this.fanulandoVacacion = false;
      this.vacacionEnProcesoAnulacion = null;
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

  public enProcesoAnulacion(vacacion): boolean {
    return this.fanulandoVacacion && (
        this.vacacionEnProcesoAnulacion.idPeriodo == vacacion.idPeriodo &&
        this.vacacionEnProcesoAnulacion.idPersona == vacacion.idPersona &&
        this.vacacionEnProcesoAnulacion.fechaInicio == vacacion.fechaInicio &&
        this.vacacionEnProcesoAnulacion.fechaFin == vacacion.fechaFin
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
}
