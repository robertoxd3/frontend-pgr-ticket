import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  baseUrl: string;
  private httpClient = inject(HttpClient);
  id!: number;
  enlace: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:5023/api/Ticket/';
  }

  getUnidades(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getUnidades');
  }

  getJson(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getJson');
  }
  
  getTipoFila(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'getTipoFilas');
  }

  guardarTicket(form: FormData): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'guardarTicket', form);
  }
 
}
