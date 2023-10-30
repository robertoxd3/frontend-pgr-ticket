import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

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
  public httpClient = inject(HttpClient);
  colaUrl?: string;
  colaWebSocket?: string;
  miCookie:any;
  
  //isConnectionEstablished = false;
  

  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
  }];
  private connection: signalR.HubConnection;

  constructor(private cookieService:CookieService) {
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
  }



  ngOnInit(groupName:string){
    this.connection.start()
      .then(_ => {
        console.log('Connection Started');
        //this.subscribeToDataUpdates();
        this.receiveInitialData();
        this.receiveTicket();
        this.join(groupName);
      }).catch(error => {
        return console.error(error);
      });
  }

  // public closeConnection(){
  //   this.connection.onclose()
  // }

  public join(groupName:string) {
    this.connection.invoke('JoinGroup', groupName)
      .then(_ => {
        this.joined = true;
      });
  }

  public sendMessage(groupName:string,message:string) {
    this.connection.invoke('SendToGroup', groupName,message)
    .then(_ => this.messageToSend = '');
  }
  
    getDataUpdates(): Observable<any> {
      return this.dataSubject.asObservable();
    }

    getTicketUpdates(): Observable<any> {
      return this.dataSubjectTicket.asObservable();
    }

    public UpdateCola(groupName:string) {
      this.connection.invoke('Conectando', groupName)
      .then(_ => console.log("Data Actualizada"));
    }

    receiveInitialData() {
        this.connection.on('InitialData',(data)=>{
              this.dataSubject.next(data);
            });
        }

       UpdateTickets(groupName:string) {
          this.connection.invoke('ObtenerTicketEnCola', groupName)
          .then(_ => console.log("Data Actualizada"));
        }
    

  receiveTicket() {
          this.connection.on('Ticket',(data)=>{
                this.dataSubjectTicket.next(data);
              });
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


 



