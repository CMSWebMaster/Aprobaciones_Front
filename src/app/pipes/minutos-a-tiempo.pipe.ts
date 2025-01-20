import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutosATiempo',
  standalone: true
})
export class MinutosATiempoPipe implements PipeTransform {
  transform(min: string): string {
    if (!min) {
      return '';
    }

    const minutos = parseInt((parseFloat(min) * 100).toString());
    const minutosEnUnDia = 1440;
    const minutosEnUnaHora = 60;

    const dias = Math.floor(minutos / minutosEnUnDia);
    const horas = Math.floor((minutos % minutosEnUnDia) / minutosEnUnaHora);
    const minutosRestantes = minutos % minutosEnUnaHora;

    let result: string[] = [];

    if (dias > 0) {
      const txt = dias === 1 ? `${dias} día` : `${dias} días`;
      result.push(txt);
    }

    if (horas > 0 || dias > 0) {
      const txt = horas === 1 ? `${horas} hora` : `${horas} horas`;
      result.push(txt);
    }

    if (minutosRestantes > 0 || result.length === 0) {
      const txt = minutosRestantes === 1 ? `${minutosRestantes} minuto` : `${minutosRestantes} minutos`;
      result.push(txt);
    }

    return result.join('   ');
  }

}
