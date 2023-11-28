import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificacionModalComponent } from '../components/notificacion-modal/notificacion-modal.component';

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
  public httpClient = inject(HttpClient);
  colaUrl?: string;
  colaWebSocket?: string;
  miCookie:any;
  public data:any;
  //isConnectionEstablished = false;
  public selectedVoice?: any;
  voz:any=[];
  public messageToSend = '';
  public joined = false;
  public recommendedVoices?: any;
  private usuario:any='{}';
   public conversation: NewMessage[] = [{
    message: 'Bienvenido',
  }];
  private connection: signalR.HubConnection;

  constructor(private cookieService:CookieService, private modalService:DialogService) {
    this.colaUrl=environment.colaUrl;
    this.colaWebSocket=environment.colaWebSocket;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.colaWebSocket,{
        skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
      })
      .build();

     this.connection.on("NewUser", message => this.newUser(message));
     this.connection.on("NewMessage", message => this.newMessage(message));
     this.connection.on("LeftUser", message => this.leftUser(message));
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
      this.join(groupName);
    }).catch(error => {
      return console.error(error);
    });
  }

  
  public join(groupName:string) {
    this.connection.invoke('JoinGroup',groupName,this.usuario)
      .then(_ => {
        this.joined = true;
      });
  }

  public sendMessage(groupName:string,message:string) {
    this.connection.invoke('SendToGroup', groupName,message)
    .then(_ => this.messageToSend = '');
  }


  public NotificationListener = (): void => {
    this.connection.on('Notification', (data): void => {
      console.log(data);
      this.showNotificationModal(data);
    });
  }

  public executeNotification = (groupname: string | null, notification: any): void => {
    this.connection.invoke('Notification', groupname,notification).catch(
        err => console.log('Error de invocación:' + err)
    );
}

private showNotificationModal(datos: any): void {
  console.log(datos)
  const ref = this.modalService.open(NotificacionModalComponent, { 
    data: {notificacion: datos},
    width: '50%', 
    // height:'350px',
    // header: 'Llamada'
});

this.synthesizeSpeechFromText(datos);

setInterval(() => {
  ref.close();
}, 6000);

  ref.onClose.subscribe((result: any) => {
      console.log('Modal cerrado', result);
  });
}



private synthesizeSpeechFromText(data:any){
      const synth = window.speechSynthesis;
      //console.log(this.recommendedVoices)
      const utterThis = new SpeechSynthesisUtterance('Numero de ticket '+data.numeroTicket+"en el escritorio "+data.escritorio);
      utterThis.lang = 'es-ES';
      utterThis.voice=this.recommendedVoices[7];
      synth.speak(utterThis);
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
      .then(_ => console.log("Data Actualizada"));
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
  private newMessage(message: NewMessage) {
    console.log(message);
    this.conversation.push(message);
  }
  private newUser(message: string) {
    console.log(message);
    this.conversation.push({
      message: message
    });
  }

  private leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      message: message
    });
  }
}


 



