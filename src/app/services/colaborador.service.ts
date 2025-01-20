import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponseColaborador } from '../interfaces/colaborador/response-colaborador.interface';

@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private url: string = environment.api_url + '/colaboradores';

  constructor(private http: HttpClient) {}

  public buscarColaborador(trabajador: string): Observable<Array<IResponseColaborador>> {
    const params = new HttpParams().append('nombre', trabajador);
    return this.http.get<Array<IResponseColaborador>>(`${this.url}/personal`, { params });
  }
}
