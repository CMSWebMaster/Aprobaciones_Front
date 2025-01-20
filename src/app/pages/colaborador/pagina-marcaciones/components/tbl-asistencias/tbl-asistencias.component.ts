import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IResponseMarcacion } from 'src/app/interfaces/marcacion/response-marcacion.interface';
import { MinutosATiempoPipe } from 'src/app/pipes/minutos-a-tiempo.pipe';

@Component({
  selector: 'app-tbl-asistencias',
  standalone: true,
  imports: [NgClass, MinutosATiempoPipe],
  templateUrl: './tbl-asistencias.component.html',
  styles: [`
    .mostrar-espacios-en-blanco {
      white-space: pre;
    }
  `]
})
export class TblAsistenciasComponent {
  public fLstMostrarDetalle = [];

  @Input({ required: true })
  public asistencias: Array<IResponseMarcacion>;

  @Input({ required: true })
  public fBuscandoAsistencias = false;

  public aNro(valor: string): number {
    return parseFloat(valor);
  }

  public hora(fecha: string | null): string {
    if (!fecha) {
      return '';
    }
    const hora = fecha.split(' ')[1];
    return hora.split('.')[0];
  }

  public soloFecha(fecha: string): string {
    return fecha.split(' ')[0];
  }

  public horaTardanza(ht: string): string {
    if (!ht) {
      return '';
    }
    const horaTardanza = parseFloat(ht);
    return horaTardanza.toString();
  }

  public toggleMostrarDetalle(asistencia: IResponseMarcacion): void {
    const resultado = this.fLstMostrarDetalle.find(a => a === asistencia.Fecha);

    if (resultado) {
      this.fLstMostrarDetalle = this.fLstMostrarDetalle.filter(a => a !== asistencia.Fecha);
    } else {
      this.fLstMostrarDetalle.push(asistencia.Fecha);
    }
  }

  public mostrarDetalle(fecha: string): boolean {
    const resultado = this.fLstMostrarDetalle.find(a => a === fecha);
    return resultado !== undefined;
  }
}
