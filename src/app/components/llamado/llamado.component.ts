import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { Subscription,of,takeUntil } from 'rxjs';
import { ColaService } from 'src/app/services/cola.service';

@Component({
  selector: 'app-llamado',
  templateUrl: './llamado.component.html',
  styleUrls: ['./llamado.component.css']
})
export class LlamadoComponent implements OnInit,OnDestroy,AfterViewInit{
  count = 1;

  @ViewChild('video') video!: ElementRef;
  @ViewChild('source') source!: ElementRef;
  //@ViewChild("video", { static: true, read: ElementRef })
  //private hubConnection: signalR.HubConnection;
  cola:any;
  message:any;
  public realTimeData: any;
  miCookie:any;
  messages: string[] = [];
  groupId:any;
  displayModal:boolean=false;
   dataSubscription: Subscription | undefined;

  constructor(private signalRService: ColaService,private cookieService: CookieService, private rd: Renderer2) {
    this.leerCookieJson();
  }

  ngOnInit() {
    this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
    this.signalRService.getDataUpdates().subscribe(data => {
          this.realTimeData = data;
          console.log(data);
    });
}
//como puedo cambiar el src del video en angular de una lista de videos en una carpeta en asset/ cada video se llama 1.mp4 y estan enumerados hasta 10 quiero que el video se cambie sin actualizar la página
ngAfterViewInit() {
//   let player = this.video.nativeElement;
//   let mp4Vid = this.source.nativeElement;
//   this.rd.listen(player, 'ended', (event) => {
//    if(!event) {
//      event = window.event;
//    }
//   console.log("Count: ",this.count);
//   this.count++;
//   this.rd.setAttribute(mp4Vid, 'src', `${this.count}.mp4`)
//   player.load();
//   player.play();
//    })
 }

 currentVideoIndex = 0;

 onVideoEnded() {
   this.changeVideo(1); // Cambia automáticamente al siguiente video cuando el video actual termine
 }
 onVideoError() {
  console.log(`Error al cargar el video: ${this.currentVideo}`);
  this.changeVideo(1); // Cambia al siguiente video en caso de error
 }

 changeVideo(step: number) {
   this.currentVideoIndex += step;
   if (this.currentVideoIndex < 0) {
     this.currentVideoIndex = this.videosLista.length - 1;
   } else if (this.currentVideoIndex >= this.videosLista.length) {
     this.currentVideoIndex = 0;
   }
 }

 get currentVideo() {
   return this.videosLista[this.currentVideoIndex];
 }

videosLista: string[] = [
  'assets/video/1.mp4',
  'assets/video/2.mp4',
  'assets/video/3.mp4',
  'assets/video/4.mp4',
  'assets/video/5.mp4',
  'assets/video/6.mp4',
  'assets/video/7.mp4',
  'assets/video/8.mp4',
  'assets/video/9.mp4',
  'assets/video/10.mp4',
];


ngOnDestroy(): void {
  this.signalRService.leave
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
