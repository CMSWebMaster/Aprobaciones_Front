import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TipoAltaMedicaEnum } from 'src/app/enums/tipo-alta-medica.enum';
import { IPacienteEnEmergencia } from 'src/app/interfaces/paciente-en-emergencia.interface';

@Component({
  selector: 'app-tbl-resumen',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tbl-resumen.component.html',
  styles: []
})
export class TblResumenComponent {
  public datosTbl: any = null;
  public indicesDatosTbl: Array<string> = [];
  public tipoAltaMedicaEnum = TipoAltaMedicaEnum;

  @Input({ required: true })
  public set lstPacientes(lstPacientes: Array<IPacienteEnEmergencia>) {
    if (lstPacientes) {
      this.generarDatosTbl(lstPacientes);
    } else {
      this.datosTbl = null;
    }
  };

  private generarDatosTbl(lstPacientes: Array<IPacienteEnEmergencia>): void {
    const agrupado = this.agrupar(lstPacientes);
    const datosTbl = this.prepararDatosTbl(agrupado);
    this.datosTbl = this.asignarDatosTbl(agrupado, datosTbl);
    this.indicesDatosTbl = Object.keys(this.datosTbl);
  }

  private agrupar(lstPacientes: Array<IPacienteEnEmergencia>): any {
    const agrupado = {};
    for (let d of lstPacientes) {
      if (d.TipoPacienteNombre in agrupado) {
        agrupado[d.TipoPacienteNombre].push(d);
      } else {
        agrupado[d.TipoPacienteNombre] = [d];
      }
    }
    return agrupado;
  }

  private prepararDatosTbl(agrupado: any): any {
    const datosTbl = {};
    for (let key of Object.keys(agrupado)) {
      const obj = {};
      obj[TipoAltaMedicaEnum.ALTA_MEDICA] = 0;
      obj[TipoAltaMedicaEnum.ALTA_VOLUNTARIA] = 0;
      obj[TipoAltaMedicaEnum.HOSPITALIZACION] = 0;
      obj[TipoAltaMedicaEnum.NO_REGISTRADO] = 0;
      datosTbl[key] = obj;
    }
    return datosTbl;
  }

  private asignarDatosTbl(agrupado: any, datosTbl: any): any {
    for (let key in agrupado) {
      const items = agrupado[key];

      for (let item of items) {
        datosTbl[key][item.Destino] = datosTbl[key][item.Destino] + 1;
      }
    }

    return datosTbl;
  }

  public sumAlta(obj: any): number {
    return obj[TipoAltaMedicaEnum.ALTA_MEDICA] + obj[TipoAltaMedicaEnum.ALTA_VOLUNTARIA];
  }

  public sumTotal(obj: any): number {
    return obj[TipoAltaMedicaEnum.NO_REGISTRADO] +
      obj[TipoAltaMedicaEnum.HOSPITALIZACION] +
      this.sumAlta(obj);
  }

  public totEnAtencion(): number {
    let total = 0;
    for (let key in this.datosTbl) {
      total += this.datosTbl[key][TipoAltaMedicaEnum.NO_REGISTRADO];
    }
    return total;
  }

  public totHospitalizado(): number {
    let total = 0;
    for (let key in this.datosTbl) {
      total += this.datosTbl[key][TipoAltaMedicaEnum.HOSPITALIZACION];
    }
    return total;
  }

  public totAlta(): number {
    let total = 0;
    for (let key in this.datosTbl) {
      total += this.sumAlta(this.datosTbl[key]);
    }
    return total;
  }

  public total(): number {
    let total = 0;
    for (let key in this.datosTbl) {
      total += this.sumTotal(this.datosTbl[key]);
    }
    return total;
  }
}
