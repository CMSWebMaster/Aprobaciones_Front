import { Component, inject, OnInit } from '@angular/core';
import { AprobacionServiciosService } from '../../services/aprobacion-servicios.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { IResponseCentroCostosAutParaUsu } from 'src/app/interfaces/aprobacion-servicios/centro-costos-aut-para-usu/response-centro-costos-aut-para-usu.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlDetalleCostoComponent } from './mdl-detalle-costo/mdl-detalle-costo.component';
import { FormsModule } from '@angular/forms';
import { IResponseOrdServPendConfirmar } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-pendientes-confirmar/response-ordenes-servicio-pendientes-confirmar.interface';
import { IRequestOrdServPendConfirmar } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-pendientes-confirmar/request-ordenes-servicio-pendientes-confirmar.interface';
import { NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { IRequestOrdenServicioParaConfirmar } from 'src/app/interfaces/aprobacion-servicios/orden-servicio-para-confirmar/request-orden-servicio-para-confirmar.interface';
import { IResponseOrdenServicioParaConfirmar } from 'src/app/interfaces/aprobacion-servicios/orden-servicio-para-confirmar/response-orden-servicio-para-confirmar.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-pagina-aprobacion-servicios',
  standalone: true,
  imports: [FormsModule, NgClass, NgbAccordionModule],
  templateUrl: './pagina-aprobacion-servicios.component.html',
  styles: []
})
export class PaginaAprobacionServiciosComponent implements OnInit {
  readonly aprobacionServiciosService = inject(AprobacionServiciosService);
  readonly modalService = inject(NgbModal);

  public ccSel = '';
  public codUsuario = '';
  public costos: Array<IResponseCentroCostosAutParaUsu> = [];
  public lstDetallePendientes: Array<IResponseOrdServPendConfirmar> = [];
  public lstDetallePendientesXProveedor: Array<Array<IResponseOrdServPendConfirmar>> = [];
  public ordServConsultando: IResponseOrdServPendConfirmar = null;

  public fBuscandoCostos = false;
  public fBuscandoDetallePendientes = false;
  public fConfirmandoServicio = false;
  public fAccesoOpConformidad = false;
  public fPuedeRealizarConformidad = false;

  ngOnInit(): void {
    this.codUsuario = localStorage.getItem('CodigoUsuario');
    this.validarAccesoOpcionConformidad();
  }

  private async validarAccesoOpcionConformidad(): Promise<void> {
    try {
      const respuesta = await firstValueFrom(
        this.aprobacionServiciosService.validarAccesoOpcionConformidad(this.codUsuario)
      );

      this.fAccesoOpConformidad = (respuesta as any).accesoValido == '1';

      if (this.fAccesoOpConformidad) {
        const respuestaConf = await firstValueFrom(
          this.aprobacionServiciosService.validarPuedeRealizarConformidadServicio(this.codUsuario)
        );
        this.fPuedeRealizarConformidad = (respuestaConf as any).puedeRealizarConformidad == '1';
        this.centroCostosAutorizadosParaUsuario();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al validar el acceso a la opción de conformidad'
      });
    }
  }

  private async centroCostosAutorizadosParaUsuario(): Promise<void> {
    try {
      this.costos = await firstValueFrom(
        this.aprobacionServiciosService.centroCostosAutorizadosParaUsuario({ codUsuario: this.codUsuario })
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar los costos autorizados para el usuario'
      });
    }
  }

  public async buscarDetallePendientes(): Promise<void> {
    try {
      this.fBuscandoDetallePendientes = true;
      this.lstDetallePendientes = [];

      const parametros: IRequestOrdServPendConfirmar = {
        centroCosto: this.ccSel,
        codUsuario: this.codUsuario,
      };

      this.lstDetallePendientes = await firstValueFrom(
        this.aprobacionServiciosService.ordenesServicioPendientesConfirmar(parametros)
      );

      this.lstDetallePendientesXProveedor = this.aguparPorProveedor(this.lstDetallePendientes);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar los servicios pendientes por confirmar'
      });
    } finally {
      this.fBuscandoDetallePendientes = false;
    }
  }

  public async confirmarServicio(pendiente: IResponseOrdServPendConfirmar): Promise<void> {
    try {
      this.ordServConsultando = pendiente;
      this.fConfirmandoServicio = true;

      const parametros: IRequestOrdenServicioParaConfirmar = {
        numeroCompromiso: pendiente.NumeroCompromiso,
        lineaDetalle: pendiente.LineaDetalle,
      };

      const ordServPendConf: IResponseOrdenServicioParaConfirmar = await firstValueFrom(
        this.aprobacionServiciosService.ordenServicioSeleccionadaParaConfirmar(parametros)
      );

      this.verDetalle(ordServPendConf, pendiente)
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al confirmar el servicio'
      });
    } finally {
      this.ordServConsultando = null;
      this.fConfirmandoServicio = false;
    }
  }

  private aguparPorProveedor(datos: Array<IResponseOrdServPendConfirmar>):
    Array<Array<IResponseOrdServPendConfirmar>>
  {
    const obj = datos.reduce((acc, obj) => {
      const proveedor = obj.Proveedor;

      if (!acc[proveedor]) {
        acc[proveedor] = [];
      }

      acc[proveedor].push(obj);

      return acc;
    }, {});

    const tmpDatos: Array<Array<IResponseOrdServPendConfirmar>> = Object.values(obj);

    tmpDatos.forEach((grupo: Array<IResponseOrdServPendConfirmar>) => {
      grupo.sort((a, b) => {
        const fechaA = DateTime.fromFormat(a.FechaPreparacion, 'yyyy-MM-dd HH:mm:ss.SSS');
        const fechaB = DateTime.fromFormat(b.FechaPreparacion, 'yyyy-MM-dd HH:mm:ss.SSS');

        if (fechaB > fechaA) {
          return 1;
        } else if (fechaB < fechaA) {
          return -1;
        } else {
          return 0;
        }
      });
    });

    return tmpDatos;
  }

  public verDetalle(
    ord: IResponseOrdenServicioParaConfirmar,
    pendiente: IResponseOrdServPendConfirmar
  ): void {
    const modal: NgbModalRef = this.modalService.open(MdlDetalleCostoComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
    modal.componentInstance.ord = ord;
    modal.componentInstance.codUsuario = this.codUsuario;
    modal.componentInstance.evtConfirmado.subscribe(() => {
      this.buscarDetallePendientes();
      Swal.fire({
        icon: 'success',
        text: 'Servicio confirmado',
      });
      // this.lstDetallePendientes = this.lstDetallePendientes.filter(
      //   p => !(
      //     p.NumeroCompromiso == pendiente.NumeroCompromiso &&
      //     p.LineaDetalle == pendiente.LineaDetalle
      //   )
      // );

      // this.lstDetallePendientesXProveedor = this.aguparPorProveedor(this.lstDetallePendientes);
    });
  }
}
