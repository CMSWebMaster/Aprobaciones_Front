import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { EvtOrdenar, ordenar, OrdenarTblDirective } from 'src/app/directives/ordenar-tbl.directive';
import { fnOrdenarColumnas } from '../../helpers/ordenar-columnas.helper';
import { IApprovalOrder } from 'src/app/pages/approval/models/IApprovalOrder';

@Component({
  selector: 'app-tbl-ordenes',
  standalone: true,
  imports: [
    FormsModule,
    NgbHighlight,
    OrdenarTblDirective,
  ],
  templateUrl: './tbl-ordenes.component.html',
  styleUrl: './tbl-ordenes.component.scss'
})
export class TblOrdenesComponent {
  public txtBusqueda = '';
  public filasTabla: Array<IApprovalOrder> = [];
  public filasVisualizar: Array<IApprovalOrder> = [];
  public opcOrdenar: EvtOrdenar = { columna: '', direccion: '' };

  @ViewChildren(OrdenarTblDirective)
  private headers: QueryList<OrdenarTblDirective>;

  @Input({ required: true })
  public set filas(filas: Array<IApprovalOrder>) {
    if (filas) {
      this.filasTabla = JSON.parse(JSON.stringify(filas));
      this.filasVisualizar = this.filasTabla;
    }
  }

  @Output()
  public evtFilaSeleccionada = new EventEmitter<IApprovalOrder>();

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

  private buscar(filasTabla: Array<IApprovalOrder>, txt: string): Array<IApprovalOrder> {
    const resultadoBusqueda = filasTabla.filter(f => f.Compromiso.toLowerCase().includes(txt) ||
      f.DescripcionLocal.toLowerCase().includes(txt) ||
      f.Nombre.toLowerCase().includes(txt));
    return this.ordenar(this.opcOrdenar, this.headers, resultadoBusqueda);
  }

  private ordenar(
    opcOrdenar: EvtOrdenar,
    headers: QueryList<OrdenarTblDirective>,
    filas: Array<IApprovalOrder>
  ): Array<IApprovalOrder> {
    return ordenar(opcOrdenar, headers, filas, fnOrdenarColumnas);
	}

  public filaSeleccionada(fila: IApprovalOrder): void {
    this.evtFilaSeleccionada.emit(fila);
  }
}
