import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AprobacionServiciosService } from '../../../services/aprobacion-servicios.service';
import { IResponseOrdenServicioParaConfirmar } from 'src/app/interfaces/aprobacion-servicios/orden-servicio-para-confirmar/response-orden-servicio-para-confirmar.interface';
import { FormsModule } from '@angular/forms';
import Decimal from 'decimal.js';
import { IRequestConfirmarServicio } from 'src/app/interfaces/aprobacion-servicios/confirmar-servicio/request-confirmar-servicio.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-mdl-detalle-costo',
  standalone: true,
  imports: [FormsModule, NgbTooltipModule],
  templateUrl: './mdl-detalle-costo.component.html',
  styles: []
})
export class MdlDetalleCostoComponent implements OnInit {
  readonly modal = inject(NgbActiveModal);
  readonly aprobacionServiciosService = inject(AprobacionServiciosService);

  public fConfirmandoServicio = false;

  public frm = {
    fechaTerminoReal: null,
    cuotas: 0,
    total: {
      c: 0,
      v: 0,
      p: 0,
    },
    recibida: {
      c: 0,
      v: 0,
      p: 0,
    },
    porRecibir: {
      c: 0,
      v: 0,
      p: 0,
    },
    nuevoSaldo: {
      c: 0,
      v: 0,
      p: 0,
    },
    comentario: '',
  };

  @Input({ required: true })
  public codUsuario: string;

  @Input({ required: true })
  public ord: IResponseOrdenServicioParaConfirmar;

  @Output()
  public evtConfirmado = new EventEmitter<void>();

  ngOnInit(): void {
    this.calcCantidades();
  }

  public async confirmarServicio(): Promise<void> {
    const error = this.validarFrm();
    if (error) {
      Swal.fire({
        icon: 'error',
        text: error,
      });
      return;
    }

    try  {
      this.fConfirmandoServicio= true;

      const parametros: IRequestConfirmarServicio = {
        tipoCompromiso: this.ord.TipoCompromiso,
        numeroCompromiso: this.ord.NumeroCompromiso,
        lineaDetalle: this.ord.LineaDetalle,
        monto: this.frm.porRecibir.v.toString(),
        comentario: this.frm.comentario.trim(),
        usuario: this.codUsuario,
      };

      await firstValueFrom(
        this.aprobacionServiciosService.confirmarServicio(parametros)
      );

      this.evtConfirmado.emit();
      this.cerrar();
    } catch (error) {
      console.error(error);
      if (error.status === 422) {
        Swal.fire({
          icon: 'error',
          text: error.error.msje,
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error confirmando el servicio',
        });
      }
    } finally {
      this.fConfirmandoServicio = false;
    }
  }

  public cambioDeCuotas(cuotas: number): void {
    if (cuotas && cuotas > 0) {
      const val = new Decimal(this.frm.total.v)
        .minus(new Decimal(this.frm.recibida.v));
      const decCuotas = new Decimal(cuotas);
      const xCuota = val.dividedBy(decCuotas).toNumber();
      setTimeout(() => this.cambioValor('v', xCuota), 300);
    }
  }

  public cambioValor(tipo: string, valor: number): void {
    if (tipo == 'c') {
      this.calcCantPorRecC(valor);
    } else if (tipo == 'v') {
      this.calcCantPorRecV(valor);
    } else if (tipo == 'p') {
      this.calcCantPorRecP(valor);
    }
  }

  private calcCantidades(): void {
    this.frm.fechaTerminoReal = DateTime.now().toFormat('yyyy-MM-dd');
    this.frm.total.c = new Decimal(this.ord.Cantidad).toNumber();
    this.frm.total.v = new Decimal(this.ord.MontoTotal).toNumber();
    this.frm.total.p = new Decimal(100).toNumber();
    this.calcCantRec();
    setTimeout(() => {
      const resta = new Decimal(this.frm.total.v)
        .minus(new Decimal(this.frm.recibida.v)).toNumber();

      this.calcCantPorRecV(resta);

      setTimeout(() => this.calcCantNSald(), 100);
    }, 100);
  }

  private calcCantRec() {
    const cantC = new Decimal(this.ord.CantidadRecibida).toNumber()
    if (cantC > 0) {
      const cantV = this.calcValXCant(cantC);

      const cantP = this.calcPorcXVal(cantV);
      this.frm.recibida.c = cantC;
      this.frm.recibida.v = cantV;
      this.frm.recibida.p = cantP;
    } else {
      this.frm.recibida.c = 0;
      this.frm.recibida.v = 0;
      this.frm.recibida.p = 0;
    }
  }

  private calcCantPorRecC(valor: number): void {
    valor = !valor ? 0 : valor;
    const tmpResta = (new Decimal(this.frm.total.c)).minus(new Decimal(this.frm.recibida.c));
    valor = valor > tmpResta.toNumber() ? 0 : valor;
    const cantC = new Decimal(valor).toNumber()
    if (cantC > 0) {
      const cantV = this.calcValXCant(cantC);
      const cantP = this.calcPorcXVal(cantV);
      this.frm.porRecibir.c = cantC;
      this.frm.porRecibir.v = cantV;
      this.frm.porRecibir.p = cantP;
      setTimeout(() => this.calcCantNSald(), 100);
    } else {
      this.frm.porRecibir.c = 0;
      this.frm.porRecibir.v = 0;
      this.frm.porRecibir.p = 0;
    }
  }
  private calcCantPorRecV(valor: number): void {
    valor = !valor ? 0 : valor;
    const tmpResta = (new Decimal(this.frm.total.v)).minus(new Decimal(this.frm.recibida.v));
    valor = valor > tmpResta.toNumber() ? 0 : valor;
    const cantV = new Decimal(valor).toNumber()
    if (cantV > 0) {
      const cantC = this.calcCantXVal(cantV);
      const cantP = this.calcPorcXVal(cantV);
      this.frm.porRecibir.c = cantC;
      this.frm.porRecibir.v = cantV;
      this.frm.porRecibir.p = cantP;
      setTimeout(() => this.calcCantNSald(), 100);
    } else {
      this.frm.porRecibir.c = 0;
      this.frm.porRecibir.v = 0;
      this.frm.porRecibir.p = 0;
    }
  }
  private calcCantPorRecP(valor: number): void {
    valor = !valor ? 0 : valor;
    const tmpResta = (new Decimal(this.frm.total.p)).minus(new Decimal(this.frm.recibida.p));
    valor = valor > tmpResta.toNumber() ? 0 : valor;
    const cantP = new Decimal(valor).toNumber()
    if (cantP > 0) {
      const cantV = this.calcValXPorc(valor);
      const cantC = this.calcCantXVal(cantV);
      this.frm.porRecibir.c = cantC;
      this.frm.porRecibir.v = cantV;
      this.frm.porRecibir.p = cantP;
      setTimeout(() => this.calcCantNSald(), 100);
    } else {
      this.frm.porRecibir.c = 0;
      this.frm.porRecibir.v = 0;
      this.frm.porRecibir.p = 0;
    }
  }

  private calcCantNSald(): void {
    this.calcCantNSaldC();
    this.calcCantNSaldV();
    this.calcCantNSaldP();
  }
  private calcCantNSaldC(): void {
    const suma = new Decimal(this.frm.recibida.c)
      .plus(new Decimal(this.frm.porRecibir.c));
    this.frm.nuevoSaldo.c = new Decimal(this.frm.total.c)
      .minus(suma).toNumber();
  }
  private calcCantNSaldV(): void {
    const suma = new Decimal(this.frm.recibida.v)
      .plus(new Decimal(this.frm.porRecibir.v));
    this.frm.nuevoSaldo.v = new Decimal(this.frm.total.v)
      .minus(suma).toNumber();
  }
  private calcCantNSaldP(): void {
    const suma = new Decimal(this.frm.recibida.p)
      .plus(new Decimal(this.frm.porRecibir.p));
    this.frm.nuevoSaldo.p = new Decimal(this.frm.total.p)
      .minus(suma).toNumber();
  }

  private calcValXCant(cant: number): number {
    const decCant = new Decimal(cant);
    const decVal = new Decimal(this.frm.total.v);
    const decC = new Decimal(this.frm.total.c);
    return decCant.times(decVal).dividedBy(decC).toNumber();
  }

  private calcCantXVal(val: number): number {
    const decVal = new Decimal(val);
    const decV = new Decimal(this.frm.total.v);
    const decC = new Decimal(this.frm.total.c);
    return decVal.times(decC).dividedBy(decV).toNumber();
  }

  private calcPorcXVal(val: number): number {
    const decVal = new Decimal(val);
    const decTot = new Decimal(this.frm.total.v);
    return decVal.dividedBy(decTot).times(100).toNumber();
  }

  private calcValXPorc(val: number): number {
    const decVal = new Decimal(val);
    const decTotV = new Decimal(this.frm.total.v);
    return decVal.times(decTotV).dividedBy(100).toNumber();
  }

  public soloFecha(fecha: string): string {
    return fecha.split(' ')[0];
  }

  private validarFrm(): string {
    if (
      this.frm.porRecibir.c === 0 &&
      this.frm.porRecibir.v === 0 &&
      this.frm.porRecibir.p === 0
    ) {
      return 'El valor por recibir es requerido';
    }

    if (this.frm.comentario.trim().length === 0) {
      return 'El comentario es requerido';
    }

    return '';
  }

  public cerrar(): void {
    this.modal.close();
  }
}
