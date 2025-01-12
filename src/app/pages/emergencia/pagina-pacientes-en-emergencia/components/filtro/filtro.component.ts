import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

export interface IFiltro {
  size: number;
  filtro_sede: string;
  filtro_fecha: string;
}

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtro.component.html',
  styles: []
})
export class FiltroComponent implements OnInit {
  @Input({ required: true })
  public filtro: IFiltro = {
    size: 0,
    filtro_sede: '',
    filtro_fecha: null,
  };

  @Input({ required: true })
  public sedes: any;

  @Input({ required: true })
  public fBuscando: boolean;

  @Output()
  public evtBuscar = new EventEmitter<void>();

  ngOnInit(): void {
    const ahora = DateTime.local();
    this.filtro.filtro_fecha = ahora.toISODate();
  }

  public emitirBuscar(): void {
    if (!this.filtro.filtro_fecha) {
      Swal.fire({
        icon: 'info',
        text: 'El campo de fecha es requerido.',
      });
      return;
    }

    if (!this.filtro.filtro_sede) {
      Swal.fire({
        icon: 'info',
        text: 'El campo de sede es requerido.',
      });
      return;
    }

    this.evtBuscar.emit();
  }
}
