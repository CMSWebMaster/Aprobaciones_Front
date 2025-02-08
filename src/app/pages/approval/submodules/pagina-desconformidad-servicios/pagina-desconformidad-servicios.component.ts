import { Component, inject, OnInit } from '@angular/core';
import { AprobacionServiciosService } from '../../services/aprobacion-servicios.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { IResponseCentroCostosAutParaUsu } from 'src/app/interfaces/aprobacion-servicios/centro-costos-aut-para-usu/response-centro-costos-aut-para-usu.interface';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { IRequestOrdServConfirmadas } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-confirmadas/request-ordenes-servicio-confirmadas.interface';
import { IResponseOrdServConfirmadas } from 'src/app/interfaces/aprobacion-servicios/ordenes-servicio-confirmadas/response-ordenes-servicio-confirmadas.interface';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IRequestDesconfirmarServicio } from 'src/app/interfaces/aprobacion-servicios/desconfirmar-servicio/request-desconfirmar-servicio.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-pagina-desconformidad-servicios',
  standalone: true,
  imports: [FormsModule, NgClass, NgbAccordionModule, NgbTooltipModule],
  templateUrl: './pagina-desconformidad-servicios.component.html',
  styles: [`
    .w-acciones {
      display: flex;
      flex-wrap: wrap;
      row-gap: 20px;
      justify-content: center;
    }
  `]
})
export class PaginaDesconformidadServiciosComponent implements OnInit {
  readonly aprobacionServiciosService = inject(AprobacionServiciosService);

  public ccSel = '';
  public codUsuario = '';

  public costos: Array<IResponseCentroCostosAutParaUsu> = [];
  public lstDetalleConfirmadas: Array<IResponseOrdServConfirmadas> = [];
  public lstDetalleConfirmadasXProveedor: Array<Array<IResponseOrdServConfirmadas>> = [];
  public ordServDesconfirmando: IResponseOrdServConfirmadas = null;

  public fAccesoOpConformidad = false;
  public fPuedeRealizarDesconformidad = false;
  public fBuscandoDetallePendientes = false;
  public fDesconfirmandoServicio = false;

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
          this.aprobacionServiciosService.validarPuedeRealizarDesconformidadServicio(this.codUsuario)
        );
        this.fPuedeRealizarDesconformidad = (respuestaConf as any).puedeRealizarDesconformidad == '1';
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

  public async buscarDetalleConfirmados(): Promise<void> {
    try {
      this.fBuscandoDetallePendientes = true;
      this.lstDetalleConfirmadas = [];

      const parametros: IRequestOrdServConfirmadas = {
        centroCosto: this.ccSel,
        codUsuario: this.codUsuario,
      };

      this.lstDetalleConfirmadas = await firstValueFrom(
        this.aprobacionServiciosService.ordenesServicioConfirmadas(parametros)
      );

      this.lstDetalleConfirmadasXProveedor = this.aguparPorProveedor(this.lstDetalleConfirmadas);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error al listar los servicios confirmados'
      });
    } finally {
      this.fBuscandoDetallePendientes = false;
    }
  }

  public async desconfirmarServicio(item: IResponseOrdServConfirmadas): Promise<void> {
    try {
      this.fDesconfirmandoServicio = true;
      this.ordServDesconfirmando = item;

      await new Promise(resolve => {
        setTimeout(() => resolve(0), 1500);
      });

      const parametros: IRequestDesconfirmarServicio = {
        codProveedor: item.Proveedor,
        docReferencia: item.DocumentoReferencia,
        usuario: this.codUsuario,
      };

      await firstValueFrom(
        this.aprobacionServiciosService.desconfirmarServicio(parametros)
      );

      this.buscarDetalleConfirmados();

      Swal.fire({
        icon: 'success',
        text: 'Servicio confirmado',
      });
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
          text: 'Ocurrió un error al desconfirmar el servicio.'
        });
      }
    } finally {
      this.fDesconfirmandoServicio = false;
      this.ordServDesconfirmando = null;
    }
  }

  private aguparPorProveedor(datos: Array<IResponseOrdServConfirmadas>):
    Array<Array<IResponseOrdServConfirmadas>>
  {
    const obj = datos.reduce((acc, obj) => {
      const proveedor = obj.Proveedor;

      if (!acc[proveedor]) {
        acc[proveedor] = [];
      }

      acc[proveedor].push(obj);

      return acc;
    }, {});

    const tmpDatos: Array<Array<IResponseOrdServConfirmadas>> = Object.values(obj);

    tmpDatos.forEach((grupo: Array<IResponseOrdServConfirmadas>) => {
      grupo.sort((a, b) => {
        const fechaA = DateTime.fromFormat(a.Fecha, 'yyyy-MM-dd HH:mm:ss.SSS');
        const fechaB = DateTime.fromFormat(b.Fecha, 'yyyy-MM-dd HH:mm:ss.SSS');

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
}
