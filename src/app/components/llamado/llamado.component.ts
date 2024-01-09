import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription,of,takeUntil } from 'rxjs';
import { ColaService } from 'src/app/services/cola.service';
import { NotificacionRe, SrColaService } from 'src/app/services/sr-cola.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-llamado',
  templateUrl: './llamado.component.html',
  styleUrls: ['./llamado.component.css'],
  providers:[DatePipe]
})
export class LlamadoComponent implements OnInit,OnDestroy{
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
  ultimoLlamado:any;
  videosLista!: string[];

  constructor(private signalRService: ColaService,private signalRColaService: SrColaService,private cookieService: CookieService, private rd: Renderer2,public datePipe: DatePipe) {
    this.leerCookieJson();
    this.validarConfigVideo();
  }

  ngOnInit() {
    this.signalRColaService.startConnection(this.miCookie.config.codigoPad);
    this.signalRColaService.getDataUpdates().subscribe(data => {
      console.log(data);
          this.realTimeData = data.response;
          this.turnoActual=data.response[0];
    });
    this.signalRColaService.NotificationListener(); 
    this.signalRColaService.notificationData.subscribe((data) => {
      console.log(data);
      //Actualizar el numero en pantalla de acuerdo al llamado
      this.turnoActual=data;
    });
    setTimeout(() => {
      this.signalRColaService.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
    }, 600);
    
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
      //this.signalRColaService.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
    }, 60000); 


  
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






ngOnDestroy(): void {
  this.signalRService.disconnect();
}

  updateDateTime() {
    this.currentDateTime = new Date();
  }

  validarConfigVideo(){
    if(this.miCookie.VideoLocal){
      this.videosLista= [
        'assets/VideoSIAPP/1.mp4',
        'assets/VideoSIAPP/2.mp4',
        'assets/VideoSIAPP/3.mp4',
        'assets/VideoSIAPP/4.mp4',
        'assets/VideoSIAPP/5.mp4',
        'assets/VideoSIAPP/6.mp4',
        'assets/VideoSIAPP/7.mp4',
        'assets/VideoSIAPP/8.mp4',
        'assets/VideoSIAPP/9.mp4',
        'assets/VideoSIAPP/10.mp4',
      ];
    }else{
      this.videosLista = [
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
    }
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
