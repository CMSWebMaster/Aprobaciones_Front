import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IResponseMarcacion } from 'src/app/interfaces/marcacion/response-marcacion.interface';
import { MinutosATiempoPipe } from 'src/app/pipes/minutos-a-tiempo.pipe';

const ANCHO_BORDE = '2px';

@Component({
  selector: 'app-tbl-asistencias',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    MinutosATiempoPipe,
  ],
  templateUrl: './tbl-asistencias.component.html',
  styles: [`
    .mostrar-espacios-en-blanco {
      white-space: pre;
    }
  `]
})
export class TblAsistenciasComponent {
  public fLstMostrarDetalle = [];
  public borderTopStyle = `${ANCHO_BORDE} solid yellow`;
  public borderBottomStyle = `${ANCHO_BORDE} solid yellow`;
  public borderLeftStyle = `${ANCHO_BORDE} solid yellow`;
  public borderRightStyle = `${ANCHO_BORDE} solid yellow`;

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

  public sinMilisegundos(fecha: string | null): string {
    if (!fecha) {
      return '';
    }
    return fecha.split('.')[0];
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
    this.fLstMostrarDetalle = [];
    if (!resultado) {
      this.fLstMostrarDetalle.push(asistencia.Fecha);
    }
  }

  public mostrarDetalle(fecha: string): boolean {
    const resultado = this.fLstMostrarDetalle.find(a => a === fecha);
    return resultado !== undefined;
  }

  public bordeColDia(item: IResponseMarcacion): object {
    if (!this.mostrarDetalle(item.Fecha)) {
      return {};
    }
    return { 'border-left': this.borderLeftStyle, 'border-top': this.borderTopStyle };
  }

  public bordeCol(item: IResponseMarcacion): object {
    if (!this.mostrarDetalle(item.Fecha)) {
      return {};
    }
    return { 'border-top': this.borderTopStyle };
  }

  public bordeColAcciones(item: IResponseMarcacion): object {
    if (!this.mostrarDetalle(item.Fecha)) {
      return {};
    }
    return { 'border-top': this.borderTopStyle, 'border-right': this.borderRightStyle };
  }

  public bordeColDetalleDia(item: IResponseMarcacion, marcacion: number): object {
    if (!this.mostrarDetalle(item.Fecha)) {
      return {};
    }

    const estilos = { 'border-left': this.borderLeftStyle };

    if (
      marcacion === 1 &&
      (this.conMarcacion2(item) || this.conMarcacion3(item) || item.Observacion)
    ) {
      return estilos;
    }

    if (
      marcacion === 2 &&
      (this.conMarcacion3(item) || item.Observacion)
    ) {
      return estilos;
    }

    if (marcacion === 3 && item.Observacion) {
      return estilos;
    }

    return { 'border-left': this.borderLeftStyle, 'border-bottom': this.borderBottomStyle };
  }

  public bordeColDetalle(item: IResponseMarcacion, marcacion: number): object {
    const estilos = { 'border-right': this.borderRightStyle };

    if (!this.mostrarDetalle(item.Fecha)) {
      return {};
    }

    if (
      marcacion === 1 &&
      (this.conMarcacion2(item) || this.conMarcacion3(item) || item.Observacion)
    ) {
      return estilos;
    }

    if (
      marcacion === 2 &&
      (this.conMarcacion3(item) || item.Observacion)
    ) {
      return estilos;
    }

    if (marcacion === 3 && item.Observacion) {
      return estilos;
    }

    return { 'border-bottom': this.borderBottomStyle, 'border-right': this.borderRightStyle };
  }

  public conMarcacion1(item: IResponseMarcacion): boolean {
    return item.HoraIng_1 || item.HoraSal_1 ? true : false;
  }

  public conMarcacion2(item: IResponseMarcacion): boolean {
    return item.HoraIng_2 || item.HoraSal_2 ? true : false;
  }

  public conMarcacion3(item: IResponseMarcacion): boolean {
    return item.HoraIng_3 || item.HoraSal_3 ? true : false;
  }

  public existenciaMarcaciones(item: IResponseMarcacion): object {
    return {
      primera: this.conMarcacion1(item),
      segunda: this.conMarcacion2(item),
      tercera: this.conMarcacion3(item),
    };
  }
}
