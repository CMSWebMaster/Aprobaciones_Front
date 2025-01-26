import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { FiltroComponent, IFiltro } from '../pagina-pacientes-en-emergencia/components/filtro/filtro.component';
import { EmergenciasService } from '../../approval/services/emergencias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-pacientes-programados-operaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe, FiltroComponent],
  templateUrl: './pagina-pacientes-programados-operaciones.component.html',
  styleUrls: ['./pagina-pacientes-programados-operaciones.component.scss'],
  providers: [EmergenciasService],
})
export class PaginaPacientesProgramadosOperacionesComponent {
  public filtro: IFiltro = {
    size: 1000,
    filtro_sede: '',
    filtro_fecha: '',
  };

  public resultados: any = null;
  public resumen: Record<string, { Ambulatorio: number; Hospitalizacion: number; Total: number }> = {};
  public fBuscando = false;
  public vistaActual: 'resumen' | 'detalle' = 'resumen';
  public resumenDisponible = false;
  public pacienteSeleccionado: Record<string, string | number | null> | null = null;

  public sedes = [
    { codigo: '0001', nombre: 'Lima' },
    { codigo: '0002', nombre: 'Chorrillos' },
    { codigo: '0004', nombre: 'Surco' },
  ];

  constructor(private emergenciasService: EmergenciasService) {}

  public async realizarConsulta(): Promise<void> {
    console.log('Filtro antes de conversión:', this.filtro);

    if (!this.filtro.filtro_sede || !this.filtro.filtro_fecha) {
      Swal.fire('Error', 'Por favor, seleccione una sede y una fecha.', 'error');
      return;
    }

    const fechaFormateada = this.filtro.filtro_fecha.replace(/-/g, '');
    console.log('Fecha formateada:', fechaFormateada);

    this.fBuscando = true;
    try {
      const respuesta = await this.emergenciasService.obtenerPacientesProgramadosOperaciones({
        sede: this.filtro.filtro_sede,
        fecha: fechaFormateada,
      }).toPromise();

      console.log('Respuesta del backend:', respuesta);
      this.resultados = respuesta.data;
      this.procesarResumen();
    } catch (error) {
      console.error('Error en la consulta:', error);
      Swal.fire('Error', 'No se pudo realizar la consulta.', 'error');
    } finally {
      this.fBuscando = false;
    }
  }

  private procesarResumen(): void {
    if (!this.resultados || this.resultados.length === 0) {
      this.resumenDisponible = false;
      this.resumen = {};
      return;
    }

    this.resumenDisponible = true;
    const resumenAgrupado = this.resultados.reduce(
      (
        resumen: Record<string, { Ambulatorio: number; Hospitalizacion: number; Total: number }>,
        paciente: any
      ) => {
        const tipoPaciente = paciente.tipoPaciente || 'No figura';
        const procedencia = paciente.procedencia;

        if (!resumen[tipoPaciente]) {
          resumen[tipoPaciente] = { Ambulatorio: 0, Hospitalizacion: 0, Total: 0 };
        }

        if (procedencia === 'Ambulatorio') {
          resumen[tipoPaciente].Ambulatorio++;
        } else if (procedencia === 'Hospitalización') {
          resumen[tipoPaciente].Hospitalizacion++;
        }

        resumen[tipoPaciente].Total++;
        return resumen;
      },
      {}
    );

    this.resumen = resumenAgrupado;
    console.log('Resumen generado:', this.resumen);
  }

  public cambiarVista(vista: 'resumen' | 'detalle'): void {
    this.vistaActual = vista;
    console.log(`Vista cambiada a: ${this.vistaActual}`);
  }

  public mostrarMasInformacion(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    console.log('Paciente seleccionado:', paciente);
  }

  public cerrarModal(): void {
    this.pacienteSeleccionado = null;
  }

  public obtenerTotalesGenerales(): { Ambulatorio: number; Hospitalizacion: number; Total: number } {
    return Object.values(this.resumen).reduce(
      (totales, tipo) => {
        totales.Ambulatorio += tipo.Ambulatorio;
        totales.Hospitalizacion += tipo.Hospitalizacion;
        totales.Total += tipo.Total;
        return totales;
      },
      { Ambulatorio: 0, Hospitalizacion: 0, Total: 0 }
    );
  }

  public formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
