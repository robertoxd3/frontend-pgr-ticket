import { DatePipe } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription,of,takeUntil } from 'rxjs';
import { ColaService } from 'src/app/services/cola.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-llamado',
  templateUrl: './llamado.component.html',
  styleUrls: ['./llamado.component.css'],
  providers:[DatePipe]
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
  turnoActual: any;
   dataSubscription: Subscription | undefined;
   currentDateTime!: any;

  constructor(private signalRService: ColaService,private cookieService: CookieService, private rd: Renderer2,public datePipe: DatePipe) {
    this.leerCookieJson();
  }

  ngOnInit() {
    this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
    this.signalRService.getDataUpdates().subscribe(data => {
          this.realTimeData = data;
          this.turnoActual=data[0];
          console.log(data);
    });
    this.signalRService.NotificationListener(); 

    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 60000); 
}


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
  environment.rutaVideos+'/Resources/VideoSIAPP/1.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/2.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/3.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/4.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/5.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/6.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/7.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/8.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/9.mp4',
  environment.rutaVideos+'/Resources/VideoSIAPP/10.mp4',
];


ngOnDestroy(): void {
  this.signalRService.disconnect();
}

sendData() {
    this.signalRService.sendMessage("PA12","PRUEBA");
       if (this.signalRService.isConnectionEstablished()) {
      this.signalRService.UpdateColaEjecutivo(this.miCookie.config.codigoPad);
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

  updateDateTime() {
    //this.currentDateTime = this.datePipe.transform(Date.now(), 'dd/MM/yyyy HH:mm');
    this.currentDateTime = new Date();
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
