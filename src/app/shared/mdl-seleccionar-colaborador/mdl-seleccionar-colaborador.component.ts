import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IResponseColaborador } from 'src/app/interfaces/colaborador/response-colaborador.interface';

@Component({
  selector: 'app-mdl-seleccionar-colaborador',
  standalone: true,
  imports: [],
  templateUrl: './mdl-seleccionar-colaborador.component.html',
  styles: []
})
export class MdlSeleccionarColaboradorComponent {
  @Input({ required: true })
  public colaboradores: Array<IResponseColaborador>;

  @Output()
  public evtSeleccionado = new EventEmitter<IResponseColaborador>();

  constructor (private modal: NgbActiveModal) {}

  public emitirSeleccion(colaborador: IResponseColaborador): void {
    this.evtSeleccionado.emit(colaborador);
    this.cerrar();
  }

  public cerrar(): void {
    this.modal.close();
  }
}
