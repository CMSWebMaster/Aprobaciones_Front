import { Component, inject, OnInit } from '@angular/core';
import { AprobacionesRRHHService } from '../../services/aprobaciones-rrhh.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { IResponsePermiso } from 'src/app/interfaces/permiso/response-permiso.interface';
import { EstadoVacacionSolicitadaEnum } from 'src/app/enums/vacacion/estado-vacacion-solicitada.enum';
import { DateTime } from 'luxon';
import { NgClass } from '@angular/common';
import { IRequestAprobarPermiso } from 'src/app/interfaces/permiso/request-aprobar-permiso.interface';

@Component({
  selector: 'app-pagina-aprobacion-permisos',
  standalone: true,
  imports: [NgClass],
  templateUrl: './pagina-aprobacion-permisos.component.html',
  styles: []
})
export class PaginaAprobacionPermisosComponent implements OnInit {
  readonly aprobacionesRRHHService = inject(AprobacionesRRHHService);

  public fAprobando = false;

  public codUsuario = '';

  public lstPermisos: Array<IResponsePermiso> = [];
  public permisoEnProcesoAprobacion: IResponsePermiso = null;

  ngOnInit(): void {
    this.codUsuario = localStorage.getItem('cod_user');
    this.listarPendientesAprobacion();
  }

  public async listarPendientesAprobacion(): Promise<void> {
    try {
      this.lstPermisos = await firstValueFrom(
        this.aprobacionesRRHHService.listarPendientesAprobacion()
      );
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar los pendientes de autorización',
      });
    }
  }

  public async aprobar(permiso: IResponsePermiso): Promise<void> {
    try {
      this.fAprobando = true;
      this.permisoEnProcesoAprobacion = permiso;

      const parametros: IRequestAprobarPermiso = {
        idPermiso: permiso.ID,
        idRespAprobar: this.codUsuario,
      };

      await firstValueFrom(this.aprobacionesRRHHService.aprobar(parametros));

      this.lstPermisos = this.lstPermisos.map(p => {
        if (p.ID == permiso.ID) {
          p.IND_ESTADO = EstadoVacacionSolicitadaEnum.REGISTRADO;
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

  public enProcesoCambioEstado(permiso: IResponsePermiso): boolean {
    return this.fAprobando && this.permisoEnProcesoAprobacion.ID == permiso.ID;
  }

  public formatearFechaYTiempo(fecha: string) {
    const date = DateTime.fromFormat(fecha, 'yyyy-MM-dd HH:mm:ss.SSS');
    return date.toFormat('yyyy-MM-dd HH:mm');
  }

  public desactivarBtnAprobar(permiso: IResponsePermiso): boolean {
    return permiso.IND_ESTADO !== EstadoVacacionSolicitadaEnum.APROBADO || this.fAprobando
  }
}
