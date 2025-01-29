import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { IResponseJefeResponsable } from 'src/app/interfaces/jefe-responsable/response-jefe-responsable.interface';
import { JefeResponsableService } from 'src/app/pages/approval/services/jefe-responsable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdl-buscar-jefe-responsable',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-header">
			<h4 class="modal-title fw-bold">Buscar Jefe Responsable</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="cerrar()"></button>
		</div>
		<div class="modal-body">
			<form>
        <div class="input-group mb-3">
          <input
            type="text"
            name="nombre"
            class="form-control"
            [disabled]="fBuscando"
            [(ngModel)]="nombre">

          <button
            class="btn btn-secondary"
            type="button"
            [disabled]="fBuscando"
            (click)="buscar()"
          >
            @if (fBuscando) {
              <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            }
            Buscar
          </button>
        </div>
      </form>

      <ul class="list-group">
        @for (jefe of jefesResponsables; track $index) {
          <li class="list-group-item d-flex justify-content-between align-items-center bg-light-subtle">
            {{ jefe.NombreCompleto }}
            <button
              type="button"
              class="btn btn-link"
              (click)="seleccionar(jefe)"
            >
              Seleccionar
            </button>
          </li>
        }
      </ul>
		</div>
		<div class="modal-footer">
			<button
        type="button"
        class="btn btn-outline-secondary"
        (click)="cerrar()"
      >
        Salir
      </button>
		</div>
  `,
  styles: []
})
export class MdlBuscarJefeResponsableComponent {
  public nombre = '';
  public jefesResponsables: Array<IResponseJefeResponsable> = [];

  public fBuscando = false;

  @Input({ required: true })
  public codigoUsuario: string;

  @Output()
  public evtJefeResponsable = new EventEmitter<IResponseJefeResponsable>();

  constructor (
    private modal: NgbActiveModal,
    private jefeResponsableService: JefeResponsableService,
  ) {}

  public async buscar(): Promise<void> {
    try {
      this.fBuscando = true;

      const jefesResponsables = await firstValueFrom(
        this.jefeResponsableService.listarPeriodos(this.nombre, null)
      );

      this.jefesResponsables = jefesResponsables
        .filter(jr => jr.CodigoUsuario == this.codigoUsuario);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al buscar los jefes responsables',
      });
    } finally {
      this.fBuscando = false;
    }
  }

  public seleccionar(jefe: IResponseJefeResponsable): void {
    this.evtJefeResponsable.emit(jefe);
    this.cerrar();
  }

  public cerrar(): void {
    this.modal.close();
  }
}
