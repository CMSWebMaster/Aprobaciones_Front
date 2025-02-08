import { Component, inject, OnInit } from '@angular/core';
import { AprobacionesSeguridadService } from '../../services/aprobaciones-seguridad.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { IResponsePermiso } from 'src/app/interfaces/permiso/response-permiso.interface';
import { DateTime } from 'luxon';
import { EstadoVacacionSolicitadaEnum } from 'src/app/enums/vacacion/estado-vacacion-solicitada.enum';
import { NgClass } from '@angular/common';
import { IRequestAprobarPermisoXPerSeg } from 'src/app/interfaces/permiso/request-aprobar-permiso-x-per-seg.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagina-aprobacion-permisos-seguridad',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './pagina-aprobacion-permisos-seguridad.component.html',
  styles: []
})
export class PaginaAprobacionPermisosSeguridadComponent implements OnInit {
  readonly aprobacionesSeguridadService = inject(AprobacionesSeguridadService);

  public fAprobando = false;

  public codUsuario = '';

  public lstPermisos: Array<IResponsePermiso> = [];
  public permisoEnProcesoAprobacion: IResponsePermiso = null;

  ngOnInit(): void {
    this.codUsuario = localStorage.getItem('cod_user');
    this.listarAprobados();
  }

  private async listarAprobados(): Promise<void> {
    try {
      this.lstPermisos = await firstValueFrom(this.aprobacionesSeguridadService.listarAprobados());
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar los aprobados',
      });
    }
  }

  public async aprobar(permiso: IResponsePermiso): Promise<void> {
    try {
      this.fAprobando = true;
      this.permisoEnProcesoAprobacion = permiso;

      const parametros: IRequestAprobarPermisoXPerSeg = {
        idPermiso: permiso.ID,
        idRespAprobar: this.codUsuario,
        horaIngreso: permiso.HORA_REAL_INGRESO,
        horaSalida: permiso.HORA_REAL_SALIDA,
      };

      await firstValueFrom(this.aprobacionesSeguridadService.aprobar(parametros));

      this.lstPermisos = this.lstPermisos.map(p => {
        if (p.ID == permiso.ID) {
          p.IND_ESTADO = EstadoVacacionSolicitadaEnum.VALIDADO;
        }
        return p;
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al aprobar el permiso',
      });
    } finally {
      this.fAprobando = false;
      this.permisoEnProcesoAprobacion = null;
    }
  }

  public enProcesoCambioEstado(permiso: IResponsePermiso): boolean {
    return this.fAprobando && this.permisoEnProcesoAprobacion.ID == permiso.ID;
  }

  public desactivarControl(permiso: IResponsePermiso): boolean {
    return permiso.IND_ESTADO !== EstadoVacacionSolicitadaEnum.REGISTRADO || this.fAprobando
  }

  public colorFondo(estado: string): object {
    return {
      'bg-success': EstadoVacacionSolicitadaEnum.APROBADO == estado ||
        EstadoVacacionSolicitadaEnum.VALIDADO == estado,
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
    if (EstadoVacacionSolicitadaEnum.VALIDADO  == estado) {
      return 'VALIDADO ';
    }
    return '';
  }

  public formatearFechaYTiempo(fecha: string) {
    const date = DateTime.fromFormat(fecha, 'yyyy-MM-dd HH:mm:ss.SSS');
    return date.toFormat('yyyy-MM-dd HH:mm');
  }
}
