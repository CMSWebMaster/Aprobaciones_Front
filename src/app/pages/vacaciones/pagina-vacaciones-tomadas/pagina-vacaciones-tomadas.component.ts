import { Component, OnInit } from '@angular/core';
import { VacacionesTomadasService } from '../../approval/services/vacaciones-tomadas.service';
import { TipoPeriodoVacacionEnum } from 'src/app/enums/vacacion/tipo-periodo-vacacion.enum';
import Swal from 'sweetalert2';
import { IPeriodo } from '../../approval/models/vacaciones/periodo.interface';
import { firstValueFrom } from 'rxjs';
import { TblPeriodosComponent } from "../components/tbl-periodos/tbl-periodos.component";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlFechasPagadasPeriodoComponent } from '../components/mdl-fechas-pagadas-periodo/mdl-fechas-pagadas-periodo.component';
import { FiltroPeriodosComponent } from '../components/filtro-periodos/filtro-periodos.component';
import { IVacacionPorJefeResponsable } from '../../approval/models/vacaciones/vacacion-por-jefe-responsable.interface';

export interface IPersonalPorArea {
  [key: string]: Array<IVacacionPorJefeResponsable>
}

@Component({
  selector: 'app-pagina-vacaciones-tomadas',
  standalone: true,
  imports: [TblPeriodosComponent, FiltroPeriodosComponent],
  templateUrl: './pagina-vacaciones-tomadas.component.html',
  styles: [`
    .contenedor-fecha-ingreso {
      width: 700px;
    }
  `]
})
export default class PaginaVacacionesTomadasComponent implements OnInit {
  public fListandoVacDelPerPorJefResp = false;
  public fListandoPeriodos = false;

  public codUsu: string;
  public lstPeriodosPagados: Array<IPeriodo> = [];
  public areas: Array<string> = [];
  public personalPorArea: IPersonalPorArea = {};
  public vacacionesPersonal: Array<IVacacionPorJefeResponsable> = [];
  public vacacionPersonalVisualizada: IVacacionPorJefeResponsable;

  constructor (
    private vacacionesTomadasService: VacacionesTomadasService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.codUsu = localStorage.getItem('CodigoUsuario');
    this.listarVacDelPersonalPorJefeResp(this.codUsu);
  }

  private async listarVacDelPersonalPorJefeResp(codUsu: string): Promise<void> {
    try {
      this.fListandoVacDelPerPorJefResp = true;

      this.vacacionesPersonal = await firstValueFrom(
        this.vacacionesTomadasService.listarVacDelPersonalPorJefeResp(codUsu)
      );

      this.personalPorArea = this.vacacionesPersonal.reduce((acc, curr) => {
        if (!acc[curr.DES_AREAS]) {
          acc[curr.DES_AREAS] = [];
        }
        acc[curr.DES_AREAS].push(curr);
        return acc;
      }, {});

      this.areas = [...new Set(this.vacacionesPersonal.map(item => item.DES_AREAS))];
    } catch (error) {
      Swal.fire({
        text: 'Error al listar los periodos pagados',
        icon: 'error',
      });
      console.log(error);
    } finally {
      this.fListandoVacDelPerPorJefResp = false;
    }
  }

  private async listarPeriodos(codPersonal: string): Promise<void> {
    try {
      this.fListandoPeriodos = true;
      this.lstPeriodosPagados = await firstValueFrom(
        this.vacacionesTomadasService.listarPeriodos(
          TipoPeriodoVacacionEnum.PAGADO,
          codPersonal,
        )
      );
    } catch (error) {
      Swal.fire({
        text: 'Error al listar los periodos',
        icon: 'error',
      });
      console.log(error);
    } finally {
      this.fListandoPeriodos = false;
    }
  }

  public filaSeleccionada(fila: IPeriodo): void  {
    const modal: NgbModalRef = this.modalService.open(MdlFechasPagadasPeriodoComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modal.componentInstance.periodo = fila;
    modal.componentInstance.vacacionPersonal = this.vacacionPersonalVisualizada;
  }

  public evtListar(codPersonal: string): void {
    this.vacacionPersonalVisualizada = this.vacacionesPersonal.find(vp => vp.COD_PERSONAL == codPersonal);
    // console.log('codPersonal', codPersonal);
    this.listarPeriodos(codPersonal);
    // this.listarPeriodos('128'); // TODO reemplazar por el comentado
  }
}
