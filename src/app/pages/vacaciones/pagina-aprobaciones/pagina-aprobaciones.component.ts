import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { IVacacionSolicitada } from '../../approval/models/vacaciones/response-vacacion-solicitada.interface';
import { VacacionesTomadasService } from '../../approval/services/vacaciones-tomadas.service';
import { EstadoVacacionSolicitadaEnum } from 'src/app/enums/vacacion/estado-vacacion-solicitada.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pagina-aprobaciones',
  standalone: true,
  imports: [NgClass],
  templateUrl: './pagina-aprobaciones.component.html',
  styleUrl: './pagina-aprobaciones.component.scss'
})
export class PaginaAprobacionesComponent implements OnInit {
  private vacacionesTomadasService = inject(VacacionesTomadasService);

  public vacacionesSolicitadas: Array<IVacacionSolicitada> = [];
  public idPersona: string = '';

  public fListandoVacacionesSolicitadas = false;

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

  public colorFondo(estado: string): object {
    return {
      'bg-success': EstadoVacacionSolicitadaEnum.APROBADO == estado,
      'bg-primary': EstadoVacacionSolicitadaEnum.PENDIENTE == estado,
      'bg-danger': EstadoVacacionSolicitadaEnum.RECHAZADO == estado,
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
    return '';
  }
}
