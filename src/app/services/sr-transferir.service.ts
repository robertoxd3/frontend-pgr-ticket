import { Injectable } from '@angular/core';
import { ICredencial } from '../model/credencial.interface';
import { environment } from 'src/environments/environment';
import { SignalrClass } from './Functions/SingalRclass';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SrTransferirService {

  public transferidosDataSubject: Subject<any> = new Subject<any>();
  
  //notificationData=this.notificationDataSubject.asObservable();
  constructor() {

   }
  private miCookie:any;
  private data:any;
  private hubConnection!: signalR.HubConnection;

  public startConnection() {
    const usuario: ICredencial = JSON.parse(localStorage.getItem('user')|| '{}');
    const url: string =  environment.colaWebSocket3;
    
    this.hubConnection = SignalrClass.buildConnection(url, usuario);

    this.hubConnection.start().then((): void => {
      this.hubConnection.invoke('JoinGroup', usuario.codigoUnidad).catch(
        err => console.log('Error de conexión:' + err)
      );
      this.receiveTicketTransferencias();
     
    }).catch(
      err => console.log('Error de conexión al hub' + err)
    );
  }

  

  getTransferidosDataUpdates(): Observable<any> {
    return this.transferidosDataSubject.asObservable();
  }
  

  receiveTicketTransferencias() {
    this.hubConnection.on('getTicketTransferencias',(data)=>{
          this.transferidosDataSubject.next(data);
        });
  }

   UpdateTransferidos(groupName:string, codigoUnidad:string) {
    this.hubConnection.invoke('GetTicketTransferencias', groupName,codigoUnidad)
    .then(_ => console.log("Data Transferidos A "));
  }
  
}
