import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IPacienteEnEmergencia } from 'src/app/interfaces/paciente-en-emergencia.interface';
import { MdlInfoPacienteEmergenciaComponent } from 'src/app/shared/mdl-info-paciente-emergencia/mdl-info-paciente-emergencia.component';

@Component({
  selector: 'app-tbl-detalle',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tbl-detalle.component.html',
  styleUrl: './tbl-detalle.component.scss'
})
export class TblDetalleComponent {
  @Input({ required: true })
  public lstPacientes: Array<IPacienteEnEmergencia> = undefined;

  constructor (private modalService: NgbModal) {}

  public mostrarDetalle(paciente: IPacienteEnEmergencia): void {
    const modal: NgbModalRef = this.modalService.open(MdlInfoPacienteEmergenciaComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modal.componentInstance.paciente = paciente;
  }

  public extraerAn(fecha): string {
    let partes = fecha.split(" ");
    let arrFecha = partes[0].split("/");
    let hora = partes[1];
    let dia = arrFecha[0];
    let mes = arrFecha[1];
    return `${dia}/${mes} ${hora}`;
  }

  public capitalizarPrimeraLetra(texto: string): string {
    return texto
      .split(" ")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(" ");
  }
}
