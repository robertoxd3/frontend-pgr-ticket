import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
import { IDisponibilidad } from '../components/ejecutivo/disponibilidad/disponibilidad.component';

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

  
  getUnidadesUser(data: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'getUnidadesUser',data);
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

  validarDisponibilidad(codigoUnidad: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'ValidarDisponibilidad/'+codigoUnidad);
  }
  

  obtenerEstadoEjecutivo(data: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'obtenerEstadoEjecutivo',data);
  }
  cambiarEstadoEjecutivo(data: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'cambiarEstadoEjecutivo',data);
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

  TransferirTicket(form: FormData): Observable<any> {
    return this.httpClient.post(this.colaUrl + 'TransferirTicket',form);
  }

  GetTransferidos(codigoUsuario: FormData): Observable<any> {
    return this.httpClient.post(this.colaUrl + 'Transferir',codigoUsuario);
  }

  ProgramarDisponibilidad(data: IDisponibilidad): Observable<any> {
    console.log(data);
    return this.httpClient.post(this.baseUrl + 'ProgramarDisponibilidad',data);
  }

  ObtenerProgramados(data: IDisponibilidad): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'ObtenerProgramados',data);
  }

  BorrarProgramado(data: IDisponibilidad): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'BorrarProgramados',data);
  }
  
  ModificarProgramado(data: IDisponibilidad): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'ModificarProgramados',data);
  }
}
