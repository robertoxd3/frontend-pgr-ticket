import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColaService {
  private hubConnection: signalR.HubConnection;
  private dataUpdateSubject: Subject<any> = new Subject<any>();
  private httpClient = inject(HttpClient);
  colaUrl: string;
  colaWebSocket: string;
  constructor() {
    this.colaUrl=environment.colaUrl;
    this.colaWebSocket=environment.colaWebSocket;
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.colaWebSocket, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
      .build();

    this.startConnection();
  }

  startConnection() {
    this.hubConnection.start().then(() => {
      console.log('Connection started');
      this.subscribeToDataUpdates();
    }).catch(err => console.log('Error while starting connection: ' + err));
  }

  private subscribeToDataUpdates() {
    this.hubConnection.on("ReceiveDataUpdate", (data) => {
      this.dataUpdateSubject.next(data);
    });
  }

  getDataUpdates(): Observable<any> {
    return this.dataUpdateSubject.asObservable();
  }

  UpdateLLamada(): Observable<any> {
    return this.httpClient.get(this.colaUrl);
  }

}

