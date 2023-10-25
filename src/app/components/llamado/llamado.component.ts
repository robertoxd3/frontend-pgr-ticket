import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ColaService } from 'src/app/services/cola.service';
@Component({
  selector: 'app-llamado',
  templateUrl: './llamado.component.html',
  styleUrls: ['./llamado.component.css']
})
export class LlamadoComponent implements OnInit, OnDestroy{
  @ViewChild("video", { static: true, read: ElementRef })
  //private hubConnection: signalR.HubConnection;


  cola:any;
  // constructor(){
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //   .configureLogging(signalR.LogLevel.Debug)
  //   .withUrl("https://localhost:7076/Cola", {
  //     skipNegotiation: true,
  //     transport: signalR.HttpTransportType.WebSockets
  //   })
  //   .build();
  // this.startConnection();
  // }

  // startConnection() {
  //   this.hubConnection.start().then(() => {
  //     console.log('Connection started');
  //   }).catch(err => console.log('Error while starting connection: ' + err));
  // }

  // addDataUpdateListener(callback: (data: any) => void) {
  //   this.hubConnection.on("ReceiveDataUpdate", data => {
  //     callback(data);
  //     console.log(data);
  //   });
  // }

  
  //private dataSubscription: Subscription;
  public realTimeData: any;
  miCookie:any;
  groupId:any;
  displayModal:boolean=false;
   dataSubscription: Subscription | undefined;

  constructor(private signalRService: ColaService,private cookieService: CookieService) {
    this.leerCookieJson();
  }

  ngOnInit() {
    this.dataSubscription = this.signalRService.getDataUpdates().subscribe(data => {
      this.realTimeData = data;
      console.log(data);
    });
    this.actualizarHub();
  }


  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  actualizarHub(){
    this.signalRService.UpdateLLamada().subscribe(data => {
      console.log("primer refresh");
    });
  }

  colas=[
    {turno: "X-951", escritorio: "5"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
    {turno: "X-952", escritorio: "3"},
  ];

  showDialog() {
    this.displayModal = true;
  }

  
  leerCookieJson(){
    const cookieName = 'cookie_tickets';
    // Verifica si la cookie existe
    
    if (this.cookieService.check(cookieName)) {
      const cookieValue = this.cookieService.get(cookieName);
      try {
        this.miCookie = JSON.parse(cookieValue);
        this.groupId=this.miCookie.config.codigoPad;
       // console.log('Valor de la cookie:', this.miCookie);
        //this.mostrarTipoFila = this.miCookie.config.mostrarTipoFila;
        //this.loadJsonToBackend(this.miCookie);
      } catch (error) {
        console.error('Error al analizar la cookie JSON:', error);
      }
    }
  }
}
