import { Injectable } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { ICredencial } from '../model/credencial.interface';
import { environment } from 'src/environments/environment';
import { SignalrClass } from './Functions/SingalRclass';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SrColaService {

  constructor(private cookieService:CookieService) {
    this.leerCookieJson();
   }
  private miCookie:any;
  private data:any;
  private hubConnection!: SignalR.HubConnection;

  public startConnection = (): void => {
    const usuario: ICredencial = JSON.parse(localStorage.getItem('user')|| '{}');
    const url: string =  environment.colaWebSocket2;
    this.hubConnection = SignalrClass.buildConnection(url, usuario);

    this.hubConnection.start().then((): void => {
      //const group = 'svl' + usuario.usercodigo;
      const group = this.miCookie.config.codigoPad;
      this.hubConnection.invoke('join', group).catch(
        err => console.log('Error de conexión:' + err)
      );

      this.executeData(group,usuario);
        this.dataListener();
    }).catch(
      err => console.log('Error de conexión al hub' + err)
    );
  }

  public dataListener = () => {
    //this.initResumenData();
    console.log('Aqui');
    this.hubConnection.on('getTicketByUser', (data) => {
      this.data.length = 0;
      // if (data.statusCode === 200) {
      //   this.data = data.response;
      // }
      this.data = data.response;
      console.log(data, 'Aqui');
    });
  }

  public executeData = (groupName:string,usuario: ICredencial | null): void => {
    this.hubConnection.invoke('getTicketByUser',groupName,usuario).catch(
      err => console.log('Error de invocación:' + err)
    );
  }

  // private initResumenData(): void {
  //   this.resumen = {
  //     nuevos: 0,
  //     resueltos: 0,
  //     enPausa: 0,
  //     enProceso: 0,
  //     procesos: 0,
  //     sinAsignar: 0,
  //     total: 0
  //   }
  // }

  leerCookieJson(){
    const cookieName = 'cookie_tickets';
    if (this.cookieService.check(cookieName)) {
      const cookieValue = this.cookieService.get(cookieName);
      try {
        this.miCookie = JSON.parse(cookieValue);
        console.log('Valor de la cookie:aa ', this.miCookie.config.codigoPad);
      } catch (error) {
        console.error('Error al analizar la cookie JSON:', error);
      }
    }
  }
}
