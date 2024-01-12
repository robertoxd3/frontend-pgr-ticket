import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificacionModalComponent } from '../components/llamado/notificacion-modal/notificacion-modal.component';

interface NewMessage {
  message: string;
  groupName?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ColaService {
  public dataSubject: Subject<any> = new Subject<any>();
  public dataSubjectTicket: Subject<any> = new Subject<any>();
  public dataUltimoTicket: Subject<any> = new Subject<any>();
  public transferidosDataSubject: Subject<any> = new Subject<any>();
  public httpClient = inject(HttpClient);
  colaUrl?: string;
  colaWebSocket?: string;
  miCookie:any;
  public data:any;
  //isConnectionEstablished = false;
  public selectedVoice?: any;
  voz:any=[];
  public joined = false;
  public recommendedVoices?: any;
  private usuario:any='{}';
  private connection: signalR.HubConnection;

  constructor(private cookieService:CookieService, private modalService:DialogService) {
    this.colaUrl=environment.colaUrl;
    this.colaWebSocket=environment.colaWebSocket;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.colaWebSocket,{
        skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(async (e) => {
        //await tryReconnect(this.connection)
      console.log('Desconectado del websocket');
    })
    
    // async function tryReconnect(connection:signalR.HubConnection) {
    //     try {
    //         let started = await connection.start()
    //         return started;
    //     } catch (e) {
    //         await new Promise(resolve => setTimeout(resolve, 60000));
    //         return await tryReconnect(connection)
    //     }
    // }
     const synth = window.speechSynthesis;
     this.recommendedVoices = synth.getVoices();
  }



  ngOnInit(groupName:string){
    this.startConnection(groupName);
    setTimeout(() => {
      const synth = window.speechSynthesis;
        this.recommendedVoices = synth.getVoices();
    }, 500);
    this.usuario = JSON.parse(localStorage.getItem('user')|| '{}');
  }

  startConnection(groupName:string){

    this.connection.start()
    .then(_ => {
      console.log('Connection Started');
      
      //this.subscribeToDataUpdates();
      this.receiveInitialData();
      this.receiveTicket();
      this.receiveLastTicket();
      this.receiveTicketTransferencias();
      this.join(groupName);
    }).catch(error => {
      return console.error(error);
    });

    this.connection.onreconnecting((error) => {
      // this.receiveInitialData();
      // this.receiveTicket();
      // this.receiveLastTicket();
      // this.receiveTicketTransferencias();
      this.join(groupName);
    
  });
  
  this.connection.onreconnected((connectionId) => {
    this.receiveInitialData();
    this.receiveTicket();
    this.receiveLastTicket();
    this.receiveTicketTransferencias();
    this.join(groupName);
 
  });
  }

  
  public join(groupName:string) {
    this.connection.invoke('JoinGroup',groupName,this.usuario)
      .then(_ => {
        this.joined = true;
      });
  }

    getDataUpdates(): Observable<any> {
      return this.dataSubject.asObservable();
    }

    getLastTicket(): Observable<any> {
      return this.dataUltimoTicket.asObservable();
    }

    getTicketUpdates(): Observable<any> {
      return this.dataSubjectTicket.asObservable();
    }

    public UpdateCola(groupName:string) {
      this.connection.invoke('Conectando', groupName,this.usuario.codigoUsuario)
      .then(_ => console.log("Data Actualizada Cola"));
    }
    

    receiveInitialData() {
        this.connection.on('InitialData',(data)=>{
              this.dataSubject.next(data);
            });
    }

    receiveTicket() {
      this.connection.on('Ticket',(data)=>{
            this.dataSubjectTicket.next(data);
          });
      }

    receiveLastTicket(){
        this.connection.on('obtenerUltimoTicket', (data) => {
          this.dataUltimoTicket.next(data);
        });
      }

      public UpdateColaEjecutivo = (groupName:string): void => {
        this.connection.invoke('ObtenerTicketEnCola', groupName, this.usuario).catch(
          err => console.log('Error de invocación:' + err)
        );
      }

      public UpdateUltimoTicket(groupname:string){
        this.connection.invoke('obtenerUltimoTicket',groupname, this.usuario).catch(
          err => console.log('Error de invocación:' + err)
        );
      }

        public disconnect() {
          this.connection.stop();
        }

    isConnectionEstablished() {
            return this.connection.state === signalR.HubConnectionState.Connected;
        }

  public leave(groupName:string) {
    this.connection.invoke('LeaveGroup',groupName)
      .then(_ => this.joined = false);
  }
  
  getTransferidosDataUpdates(): Observable<any> {
    return this.transferidosDataSubject.asObservable();
  }

  receiveTicketTransferencias() {
    this.connection.on('getTicketTransferencias',(data)=>{
          this.transferidosDataSubject.next(data);
        });
  }

   UpdateTransferidos(groupName:string, codigoUnidad:string) {
    this.connection.invoke('GetTicketTransferencias', groupName,codigoUnidad)
    .then(_ => console.log("Data Trasnferidos Actualizada"));
  }
  
}


 



