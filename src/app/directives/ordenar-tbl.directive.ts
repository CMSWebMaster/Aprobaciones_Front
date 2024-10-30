import { Directive, EventEmitter, Input, Output, QueryList } from "@angular/core";

export type ColumnaOrdenar = string | '' | null | number;
export type DirOrdenamiento = 'asc' | 'desc' | '';

const rotar: { [key: string]: DirOrdenamiento } = { asc: 'desc', desc: '', '': 'asc' };

export const comparar = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export const ordenar = (
  { columna, direccion }: EvtOrdenar,
  headers: QueryList<OrdenarTblDirective>,
  filas: Array<any>,
  callback: (obj: EvtOrdenar, filas: Array<any>) => Array<any>
) => {
  for (const header of headers) {
    if (header.ordenable !== columna) {
      header.direccion = '';
    }
  }

  if (direccion === '' || columna === '') {
    return filas;
  } else {
    return callback({ columna, direccion }, filas);
  }
}

export interface EvtOrdenar {
	columna: ColumnaOrdenar;
	direccion: DirOrdenamiento;
}

@Directive({
	selector: 'th[ordenable]',
	standalone: true,
	host: {
		'[class.asc]': 'direccion === "asc"',
		'[class.desc]': 'direccion === "desc"',
		'(click)': 'rotar()',
	},
})
export class OrdenarTblDirective {
	@Input()
  public ordenable: ColumnaOrdenar = '';

	@Input()
  public direccion: DirOrdenamiento = '';

	@Output()
  public evtOrdenar = new EventEmitter<EvtOrdenar>();

	rotar() {
    this.direccion = rotar[this.direccion];
		this.evtOrdenar.emit({ columna: this.ordenable, direccion: this.direccion });
	}
}
