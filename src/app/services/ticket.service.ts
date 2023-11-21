import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  baseUrl: string;
  colaUrl: string;
  private httpClient = inject(HttpClient);
  id!: number;
  enlace: string = '';

  constructor() {
    this.baseUrl = environment.apiUrl;
    this.colaUrl= environment.colaUrl;
  }

  getUnidades(json: any): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Configuracion': JSON.stringify(json) 
    });

    return this.httpClient.post(this.baseUrl + 'getUnidades', null, { headers });
  }
  
  getTipoFila(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getTipoFilas');
  }

  guardarTicket(form: FormData,json:any): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Configuracion': JSON.stringify(json) 
    });

    return this.httpClient.post(this.baseUrl + 'guardarTicket', form, { headers });
  
  }

  printInfo(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'printInfo');
  }

  printInfoDenucias(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'printInfo2');
  }

  procedimientoAlmacenado(form: FormData): Observable<any> {
    return this.httpClient.post(this.colaUrl + 'ProcedimientoTicket',form);
  }

  ObtenerTicketFinalizados(form: FormData): Observable<any> {
    return this.httpClient.post(this.colaUrl + 'ObtenerTicketFinalizados',form);
  }
}
