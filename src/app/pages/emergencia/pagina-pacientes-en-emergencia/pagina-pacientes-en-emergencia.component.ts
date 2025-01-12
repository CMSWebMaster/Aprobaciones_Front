import { Component } from '@angular/core';
import { EmergenciasService } from '../../approval/services/emergencias.service';
import { firstValueFrom } from 'rxjs';
import { SEDES } from '../../../data/sedes.data';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FiltroComponent, IFiltro } from './components/filtro/filtro.component';
import { TblDetalleComponent } from './components/tbl-detalle/tbl-detalle.component';
import { TblResumenComponent } from './components/tbl-resumen/tbl-resumen.component';
import { IPacienteEnEmergencia } from 'src/app/interfaces/paciente-en-emergencia.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-pacientes-en-emergencia',
  standalone: true,
  imports: [
    NgbNavModule,
    FiltroComponent,
    TblResumenComponent,
    TblDetalleComponent,
  ],
  templateUrl: './pagina-pacientes-en-emergencia.component.html',
  styles: []
})
export class PaginaPacientesEnEmergenciaComponent {
  public tab = 1;
  public sedes = SEDES;
  public fBuscandoECH = false;
  public lstPacientes: Array<IPacienteEnEmergencia> = undefined;
  public filtroBusqueda: IFiltro = {
    size: 1000,
    filtro_sede: '',
    filtro_fecha: null,
  };

  constructor (private emergenciasService: EmergenciasService) {}

  public async buscarEmConHot(): Promise<void> {
    try {
      this.lstPacientes = undefined;
      this.fBuscandoECH = true;
      const respuesta: any = await firstValueFrom(this.emergenciasService.buscarEmerConsultaHoteleria(this.filtroBusqueda));
      this.lstPacientes = respuesta.data.data;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error la realizar la búsqueda.'
      });
    } finally {
      this.fBuscandoECH = false;
    }
  }
}
