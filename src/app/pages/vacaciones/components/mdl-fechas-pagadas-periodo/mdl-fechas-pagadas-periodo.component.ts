import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { IFechaPagadaPeriodo } from 'src/app/pages/approval/models/vacaciones/fecha-pagada-periodo.interface';
import { IPeriodo } from 'src/app/pages/approval/models/vacaciones/periodo.interface';
import { VacacionesTomadasService } from 'src/app/pages/approval/services/vacaciones-tomadas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdl-fechas-pagadas-periodo',
  standalone: true,
  imports: [],
  templateUrl: './mdl-fechas-pagadas-periodo.component.html',
  styleUrl: './mdl-fechas-pagadas-periodo.component.scss'
})
export class MdlFechasPagadasPeriodoComponent implements OnInit {
  public lstFechaPagada: Array<IFechaPagadaPeriodo> = [];

  public fListandoFechasPagadas = false;

  @Input({ required: true })
  public periodo: IPeriodo;

  constructor(
    private vacacionesTomadasService: VacacionesTomadasService,
    private modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.listarFechasPagadas();
  }

  private async listarFechasPagadas(): Promise<void> {
    try {
      this.fListandoFechasPagadas = true;
      this.lstFechaPagada = await firstValueFrom(
        this.vacacionesTomadasService.listarFechasPagadasPorPeriodo(
          this.periodo.Empleado,
          this.periodo.NumeroPeriodo,
        )
      );
    } catch (error) {
      Swal.fire({
        text: 'Error al listar los las fechas pagadas por periodo.',
        icon: 'error',
      });
      console.log(error);
    } finally {
      this.fListandoFechasPagadas = false;
    }
  }

  public totalDiasUtilizacion(): string {
    const suma = this.lstFechaPagada.reduce((prev, act) => prev + +act.DiasUtilizacion, 0);
    return suma.toFixed(2);
  }

  public cerrar(): void {
    this.modal.close();
  }
}
