import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPacienteEnEmergencia } from 'src/app/interfaces/paciente-en-emergencia.interface';

@Component({
  selector: 'app-mdl-info-paciente-emergencia',
  standalone: true,
  imports: [],
  templateUrl: './mdl-info-paciente-emergencia.component.html',
  styles: []
})
export class MdlInfoPacienteEmergenciaComponent {
  @Input({ required: true })
  public paciente: IPacienteEnEmergencia;

  constructor(private modal: NgbActiveModal) {}

  public cerrar(): void {
    this.modal.close();
  }
}
