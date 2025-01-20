import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';

export interface IFiltroColaborador {
  fechaInicio: string;
  fechaFin: string;
  trabajador: string;
}

@Component({
  selector: 'app-filtro-colaborador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtro-colaborador.component.html',
  styles: [`
    .controles {
      row-gap: 12px;
    }

    .mw {
      min-width: 103.5px;
      text-align: right;
    }
  `]
})
export class FiltroColaboradorComponent implements OnInit {
  public filtro: IFiltroColaborador = {
    fechaInicio: null,
    fechaFin: null,
    trabajador: '',
  };

  @Input({ required: true })
  public fBuscando: boolean;

  @Output()
  public evtBuscar = new EventEmitter<IFiltroColaborador>();

  ngOnInit(): void {
    const fechaActual = DateTime.local();
    const fechaInicio = fechaActual.minus({ days: 8 });
    const fechaFin = fechaActual.minus({ days: 1 });

    this.filtro.fechaInicio = fechaInicio.toISODate();
    this.filtro.fechaFin = fechaFin.toISODate();
  }

  public emitirBuscar(): void {
    const error = this.validarFiltro();

    if (error) {
      Swal.fire({
        icon: 'error',
        text: error,
      });
      return;
    }

    return this.evtBuscar.emit(this.filtro);
  }

  private validarFiltro(): string | null {
    if (!this.filtro.fechaInicio) {
      return 'Ingresa la fecha de inicio';
    }

    if (!this.filtro.fechaFin) {
      return 'Ingresa la fecha de fin';
    }

    if (this.filtro.fechaInicio && this.filtro.fechaFin) {
      const inicio = DateTime.fromISO(this.filtro.fechaInicio);
      const fin = DateTime.fromISO(this.filtro.fechaFin);

      if (inicio > fin) {
        return 'La fecha de inicio debe ser menor o igual a la fecha de fin';
      }
    }

    if (!this.filtro.trabajador && this.filtro.trabajador.trim().length === 0) {
      return 'Ingresa el nombre del trabajador a buscar';
    }

    return null;
  }
}
