import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPersonalPorArea } from '../../pagina-vacaciones-tomadas/pagina-vacaciones-tomadas.component';
import { FormsModule } from '@angular/forms';
import { IVacacionPorJefeResponsable } from 'src/app/pages/approval/models/vacaciones/vacacion-por-jefe-responsable.interface';

@Component({
  selector: 'app-filtro-periodos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtro-periodos.component.html',
  styleUrl: './filtro-periodos.component.scss'
})
export class FiltroPeriodosComponent {
  public fTodasLasAreas = false;
  public areaSeleccionada = '';
  public colaboradorSeleccionado = '';
  public lstColaboradorPorArea: Array<IVacacionPorJefeResponsable> = [];

  @Input({ required: true })
  public areas: Array<string> = [];

  @Input({ required: true })
  public personalPorArea: IPersonalPorArea = {};

  @Output()
  public evtListar = new EventEmitter<string>();

  public cambioIndTodasLasAreas(): void {
    if (this.fTodasLasAreas) {
      this.areaSeleccionada = '';
      this.colaboradorSeleccionado = '';
      this.evtListar.emit(this.strLstIds());
    }
  }

  private strLstIds(): string {
    const arrIds: Array<string> = [];

    for (let area of this.areas) {
      const lst = this.personalPorArea[area];

      for (let p of lst) {
        arrIds.push(p.COD_PERSONAL);
      }
    }

    return arrIds.join(',');
  }

  public seleccionDeArea(): void {
    this.lstColaboradorPorArea = this.personalPorArea[this.areaSeleccionada];
  }

  public seleccionDeColaborador(): void {
    this.evtListar.emit(this.colaboradorSeleccionado);
  }
}
