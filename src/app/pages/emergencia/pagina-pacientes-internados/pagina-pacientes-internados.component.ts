import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { FiltroComponent, IFiltro } from '../pagina-pacientes-en-emergencia/components/filtro/filtro.component';
import { EmergenciasService } from '../../approval/services/emergencias.service';

@Component({
  selector: 'app-pagina-pacientes-internados',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe, FiltroComponent],
  templateUrl: './pagina-pacientes-internados.component.html',
  styleUrls: ['./pagina-pacientes-internados.component.scss'],
  providers: [EmergenciasService],
})
export class PaginaPacientesInternadosComponent {
  public filtro: IFiltro = {
    size: 1000,
    filtro_sede: '',
    filtro_fecha: '',
  };

  public resultados: any = null;
  public resumen: Record<string, { Hospitalizado: number; Alta: number; Total: number }> = {};
  public fBuscando = false;
  public vistaActual: 'resumen' | 'detalle' = 'resumen';
  public resumenDisponible = false;
  public pacienteSeleccionado: any = null;

  // Definir las sedes
  public sedes = [
    { codigo: '0001', nombre: 'Lima' },
    { codigo: '0002', nombre: 'Chorrillos' },
    { codigo: '0004', nombre: 'Surco' },
  ];

  constructor(private emergenciasService: EmergenciasService) {}

  public async realizarConsulta(): Promise<void> {
    console.log('Filtro antes de conversión:', this.filtro);

    // Validación básica de campos requeridos inicio
    if (!this.filtro.filtro_sede || !this.filtro.filtro_fecha) {
      alert('Por favor ingrese una sede y una fecha.');
      return;
    }
    // Validación básica de campos requeridos fin

    // Convertir la fecha al formato esperado por el backend (YYYYMMDD)
    const fechaFormateada = this.filtro.filtro_fecha.replace(/-/g, '');
    console.log('Fecha formateada:', fechaFormateada);

    this.fBuscando = true;
    try {
      const respuesta = await this.emergenciasService
        .obtenerPacientesInternadosPOST({
          sede: this.filtro.filtro_sede,
          fecha: fechaFormateada,
        })
        .toPromise();

      console.log('Respuesta del backend:', respuesta);
      this.resultados = respuesta.data; // Almacenar los datos del backend
      this.procesarResumen();
    } catch (error) {
      console.error('Error en la consulta:', error);
      alert(`Error al realizar la consulta: ${error.message || 'Error desconocido'}`);
    } finally {
      this.fBuscando = false;
    }
  }

  private procesarResumen(): void {
    if (this.resultados.length === 0) {
      this.resumenDisponible = false; // No hay datos disponibles
      this.resumen = {};
      return;
    }

    this.resumenDisponible = true;
    const resumenAgrupado: Record<string, { Hospitalizado: number; Alta: number; Total: number }> =
      this.resultados.reduce((resumen, paciente) => {
        const tipoPaciente = paciente.Tipo_Paciente || 'No Especificado';
        const estado = paciente.F_Alta ? 'Alta' : 'Hospitalizado';

        if (!resumen[tipoPaciente]) {
          resumen[tipoPaciente] = { Hospitalizado: 0, Alta: 0, Total: 0 };
        }

        resumen[tipoPaciente][estado]++;
        resumen[tipoPaciente].Total++;

        return resumen;
      }, {});

    this.resumen = resumenAgrupado;
    console.log('Resumen generado:', this.resumen);
  }

  public cambiarVista(vista: 'resumen' | 'detalle'): void {
    this.vistaActual = vista;
    console.log(`Vista cambiada a: ${this.vistaActual}`);
  }

  public abrirModal(paciente: any): void {
    this.pacienteSeleccionado = paciente; // Almacenar el paciente seleccionado
    console.log('Paciente seleccionado:', paciente);
  }

  public cerrarModal(): void {
    this.pacienteSeleccionado = null; // Limpiar la selección
  }

  public obtenerTotalesGenerales(): { Hospitalizado: number; Alta: number; Total: number } {
    return Object.values(this.resumen).reduce(
      (totales, tipo) => {
        totales.Hospitalizado += tipo.Hospitalizado;
        totales.Alta += tipo.Alta;
        totales.Total += tipo.Total;
        return totales;
      },
      { Hospitalizado: 0, Alta: 0, Total: 0 } // Inicializar totales en 0
    );
  }
}
