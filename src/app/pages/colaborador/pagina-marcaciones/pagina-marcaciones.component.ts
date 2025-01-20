import { Component } from '@angular/core';
import { FiltroColaboradorComponent, IFiltroColaborador } from './components/filtro-colaborador/filtro-colaborador.component';
import Swal from 'sweetalert2';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { MarcacionService } from 'src/app/services/marcacion.service';
import { firstValueFrom } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlSeleccionarColaboradorComponent } from 'src/app/shared/mdl-seleccionar-colaborador/mdl-seleccionar-colaborador.component';
import { IResponseMarcacion } from 'src/app/interfaces/marcacion/response-marcacion.interface';
import { TblAsistenciasComponent } from './components/tbl-asistencias/tbl-asistencias.component';

@Component({
  selector: 'app-pagina-marcaciones',
  standalone: true,
  imports: [
    FiltroColaboradorComponent,
    TblAsistenciasComponent,
  ],
  templateUrl: './pagina-marcaciones.component.html',
  styles: []
})
export class PaginaMarcacionesComponent {
  public asistencias!: Array<IResponseMarcacion>;

  public fBuscandoTrabajador = false;
  public fBuscandoAsistencias = false;

  constructor (
    private colaboradorService: ColaboradorService,
    private marcacionService: MarcacionService,
    private modalService: NgbModal,
  ) {}

  public async buscarColaborador(filtros: IFiltroColaborador): Promise<void> {
    try {
      this.fBuscandoTrabajador = true;
      const colaboradores = await firstValueFrom(this.colaboradorService.buscarColaborador(filtros.trabajador));
      const modal: NgbModalRef = this.modalService.open(MdlSeleccionarColaboradorComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
      });
      modal.componentInstance.colaboradores = colaboradores;
      modal.componentInstance.evtSeleccionado.subscribe(col => {
        this.listarAsistenciaDelColaborador(col.idColaborador, filtros.fechaInicio, filtros.fechaFin);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Error buscando al trabajador'
      })
    } finally {
      this.fBuscandoTrabajador = false;
    }
  }

  private async listarAsistenciaDelColaborador(
    idCol: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<void> {
    try {
      this.fBuscandoAsistencias = true;
      this.asistencias = undefined;
      this.asistencias = await firstValueFrom(
        this.marcacionService.asistenciaColaborador(idCol, fechaInicio, fechaFin)
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Error buscando las asistencias del trabajador'
      })
    } finally {
      this.fBuscandoAsistencias = false;
    }
  }
}
