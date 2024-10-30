import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { EvtOrdenar, ordenar, OrdenarTblDirective } from 'src/app/directives/ordenar-tbl.directive';
import { IPeriodo } from 'src/app/pages/approval/models/vacaciones/periodo.interface';
import { fnOrdenarColumnas } from '../../helpers/ordenar-columnas.helper';
import { FormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tbl-periodos',
  standalone: true,
  imports: [
    FormsModule,
    NgbHighlight,
    OrdenarTblDirective,
  ],
  templateUrl: './tbl-periodos.component.html',
  styleUrl: './tbl-periodos.component.scss'
})
export class TblPeriodosComponent {
  public txtBusqueda = '';
  public filasTabla: Array<IPeriodo> = [];
  public filasVisualizar: Array<IPeriodo> = [];
  public opcOrdenar: EvtOrdenar = { columna: '', direccion: '' };

  @ViewChildren(OrdenarTblDirective)
  private headers: QueryList<OrdenarTblDirective>;

  @Input({ required: true })
  public fListando;

  @Input({ required: true })
  public set filas(filas: Array<IPeriodo>) {
    if (filas) {
      this.filasTabla = JSON.parse(JSON.stringify(filas));
      this.filasVisualizar = this.filasTabla;
    }
  }

  @Output()
  public evtFilaSeleccionada = new EventEmitter<IPeriodo>();

  public accionOrdenar(opcOrdenar: EvtOrdenar): void {
    this.opcOrdenar = opcOrdenar;
    this.filasVisualizar = this.ordenar(this.opcOrdenar, this.headers, this.filasTabla);
  }

  public cambioTxtBusqueda(): void {
    if (this.txtBusqueda && this.txtBusqueda.trim().length > 0) {
      this.filasVisualizar = this.buscar(this.filasTabla, this.txtBusqueda.toLowerCase().trim());
    } else {
      this.filasVisualizar = this.ordenar(this.opcOrdenar, this.headers, this.filasTabla);
    }
  }

  private buscar(filasTabla: Array<IPeriodo>, valor: any): Array<IPeriodo> {
    const resultadoBusqueda = filasTabla.filter(f => f.NomEmpleado.toLowerCase().includes(valor) ||
      f.NumeroPeriodo.includes(valor) ||
      f.PeriodoVac.includes(valor) ||
      f.Derecho.includes(valor) ||
      f.DiasGozados.includes(valor) ||
      f.Pendientes.includes(valor)
    );
    return this.ordenar(this.opcOrdenar, this.headers, resultadoBusqueda);
  }

  private ordenar(
    opcOrdenar: EvtOrdenar,
    headers: QueryList<OrdenarTblDirective>,
    filas: Array<IPeriodo>
  ): Array<IPeriodo> {
    return ordenar(opcOrdenar, headers, filas, fnOrdenarColumnas);
	}

  public filaSeleccionada(fila: IPeriodo): void {
    this.evtFilaSeleccionada.emit(fila);
  }

  public totalGoce(): string {
    const total = this.filasTabla.reduce((acc, obj) => parseFloat(obj.DiasGozados) + acc, 0);
    return total.toFixed(2);
  }
}
