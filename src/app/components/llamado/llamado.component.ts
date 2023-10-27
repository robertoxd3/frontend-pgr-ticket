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
export class LlamadoComponent implements OnInit{
  @ViewChild("video", { static: true, read: ElementRef })
  //private hubConnection: signalR.HubConnection;
  cola:any;
  message:any;
  public realTimeData: any;
  miCookie:any;
  messages: string[] = [];
  groupId:any;
  displayModal:boolean=false;
   dataSubscription: Subscription | undefined;

  constructor(private signalRService: ColaService,private cookieService: CookieService) {
    this.leerCookieJson();
  }

  ngOnInit() {
    this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
    
    this.signalRService.getDataUpdates().subscribe(data => {
          this.realTimeData = data;
          console.log(data);
    });

 

   
}

sendData() {
    this.signalRService.sendMessage("PA12","PRUEBA");
       if (this.signalRService.isConnectionEstablished()) {
      this.signalRService.UpdateTickets(this.miCookie.config.codigoPad);
  } else {
      console.error('La conexión SignalR no está establecida.');
  }
    //this.signalRService.UpdateCola("PA12");
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
    this.sendData();
  }

  
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
