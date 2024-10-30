import { comparar, EvtOrdenar } from "src/app/directives/ordenar-tbl.directive";

export function fnOrdenarColumnas(
  { columna, direccion }: EvtOrdenar,
  filas: Array<any>,
): Array<any> {
  return [...filas].sort((a, b) => {
    const res = comparar(a[columna], b[columna]);
    return direccion === 'asc' ? res : -res;
  });
}
