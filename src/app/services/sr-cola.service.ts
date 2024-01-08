import { Injectable } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { ICredencial } from '../model/credencial.interface';
import { environment } from 'src/environments/environment';
import { SignalrClass } from './Functions/SingalRclass';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificacionModalComponent } from '../components/notificacion-modal/notificacion-modal.component';
import { Observable, Subject } from 'rxjs';

export interface NotificacionRe {
  numeroTicket: string;
  noEscritorio: string;
}

@Injectable({
  providedIn: 'root'
})

export class SrColaService  {
  public recommendedVoices?: any;
  public dataSubject: Subject<any> = new Subject<any>();
  public transferidosDataSubject: Subject<any> = new Subject<any>();
  public notificationDataSubject = new Subject<NotificacionRe>();
  notificationData=this.notificationDataSubject.asObservable();
  public voices: SpeechSynthesisVoice[] = [];
  synthesis = window.speechSynthesis;

  constructor(private cookieService:CookieService, private modalService:DialogService) {
    this.leerCookieJson();
    setTimeout(() => {
      this.fetchVoices();
    }, 500);
    //  this.fetchVoices();
   }
  private miCookie:any;
  private data:any;
  private hubConnection!: SignalR.HubConnection;

  public startConnection(group:string) {
    try {
      //const group = this.miCookie.config.codigoPad;
      const usuario: ICredencial = JSON.parse(localStorage.getItem('user')|| '{}');
      const url: string =  environment.colaWebSocket2;
      
      this.hubConnection = SignalrClass.buildConnection(url, usuario);
      console.log('Grupo a UNIRSE:'+group);
      this.hubConnection.start().then((): void => {
        this.hubConnection.invoke('join', group).catch(
          err => console.log('Error de conexión:' + err+'\nReconnectado)')
        );
  
        this.receiveInitialData();
        //this.getTicketTransferencias();
      }).catch(
        err => console.log('Error de conexión al hub' + err)
      );

      this.hubConnection.onreconnecting((error) => {
        this.receiveInitialData();
        console.log('reconnectandoxd');
        this.hubConnection.invoke('join', group).catch(
          err => console.log('Error de conexión:' + err+'\nReconnectado)')
        );
    });
    
    this.hubConnection.onreconnected((connectionId) => {
      this.receiveInitialData();
      console.log('reconnectandoxdxd');
      this.hubConnection.invoke('join', group).catch(
        err => console.log('Error de conexión:' + err+'\nReconnectado)')
      );
    });

    } catch (error) {
      console.log('errrorr');
    }
  }



  

  // loadVoices() {
  //   const synth = window.speechSynthesis;

  //   // Obtener las voces cuando la página se cargue
  //   setTimeout(() => {
  //     this.voices = synth.getVoices();
  //    // console.log(this.voices);
  //   }, 1000); // Cambia el tiempo de espera si es necesario

  //   // También puedes usar el evento 'voiceschanged' para actualizar las voces
  //   synth.onvoiceschanged = () => {
  //     this.voices = synth.getVoices();
  //     //console.log(this.voices);
  //   };
  // }

 

  getDataUpdates(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  receiveInitialData() {
    this.hubConnection.on('getTicketLlamada',(data)=>{
          this.dataSubject.next(data);
        });
}

   UpdateCola(groupName:string, codigoUnidad:string) {
    this.hubConnection.invoke('GetTicketLlamada', groupName,codigoUnidad)
    .then(_ => console.log("Data Actualizada UpdateCola llamado"));
  }

  UpdateTransferidos(groupName:string, codigoUnidad:string) {
    this.hubConnection.invoke('GetTicketLlamada', groupName,codigoUnidad)
    .then(_ => console.log("Data Actualizada Transferidos"));
  }

  // getTransferidosDataUpdates(): Observable<any> {
  //   return this.transferidosDataSubject.asObservable();
  // }

  // getTicketTransferencias() {
  //   this.hubConnection.on('getTicketTransferencias',(data)=>{
  //         this.transferidosDataSubject.next(data);
  //       });
  // }

  //  UpdateTransferidos(groupName:string, codigoUnidad:string) {
  //   this.hubConnection.invoke('GetTicketTransferencias', groupName,codigoUnidad)
  //   .then(_ => console.log("Data Trasnferidos Actualizada"));
  // }
  

   NotificationListener(){
    this.hubConnection.on('Notification', (data)=>{
      this.showNotificationModal(data);
      // return data;
      this.notificationDataSubject.next(data);
    });
  }

   executeNotification(groupname: string | null, notification: NotificacionRe) {
    this.hubConnection.invoke('Notification', groupname,notification).catch(
        err => console.log('Error de invocación:' + err)
    );
  }

showNotificationModal(datos: NotificacionRe): void {
  console.log(datos);
  //  this.loadVoicesAndSpeak(datos);
  this.speak(datos);
  const ref = this.modalService.open(NotificacionModalComponent, { 
    data: { notificacion: datos },
    width: '60%',
    style: { opacity: '1' },
    // height:'350px',
    // header: 'Llamada'
  });
  setInterval(() => {
    
    ref.close();
  }, 6000);

  ref.onClose.subscribe((result: any) => {
    console.log('Modal cerrado', result);
  });
}

fetchVoices() {
  this.voices = window.speechSynthesis.getVoices();
  console.log(this.voices);
  //localStorage.setItem('voices', JSON.stringify(this.voices));
}

  speak(data: any) {
    const selectedVoice = this.voices.find(voice => voice.lang === 'es-ES');
    console.log('Speaking..');
    console.log(selectedVoice);
    const utterance = new SpeechSynthesisUtterance('Número de ticket ' + data.numeroTicket + " en el escritorio " + data.noEscritorio);
    if (selectedVoice) {
     // const selectedVoice: SpeechSynthesisVoice = JSON.parse(selectedVoiceString);
      utterance.voice = selectedVoice;
      utterance.lang = 'es-Es';
      utterance.rate = 0.7;
    }
    this.synthesis.speak(utterance);
  }


// loadVoicesAndSpeak(data: any): void {
//   const synth = window.speechSynthesis;

//   const speakWhenVoicesReady = () => {
//     const recommendedVoices = synth.getVoices();
//     console.log(recommendedVoices);

//     const vozFemenina = recommendedVoices.find(voice => {
//       return voice.lang === 'es-ES' && voice.name.includes('Femenino');
//     });

//     const utterThis = new SpeechSynthesisUtterance('Número de ticket ' + data.numeroTicket + " en el escritorio " + data.idEscritorio);
//     utterThis.lang = 'es';
//     utterThis.rate = 0.7;
//     utterThis.voice = vozFemenina || null;

//     synth.speak(utterThis);
//   };

//   // Verificar si las voces ya están disponibles
//   if (synth.getVoices().length !== 0) {
//     speakWhenVoicesReady();
//   } else {
//     // Esperar al evento 'voiceschanged' para saber cuándo las voces están listas
//     synth.onvoiceschanged = speakWhenVoicesReady;
//   }
// }
// synthesizeSpeechFromText(data: any) {
//   const synth = window.speechSynthesis;

//   const speakWhenVoicesReady = () => {
//     const recommendedVoices = synth.getVoices();
//     console.log(recommendedVoices);

//     const vozFemenina = recommendedVoices.find(voice => {
//       return voice.lang === 'es-ES' && voice.name.includes('Femenino');
//     });

//     const utterThis = new SpeechSynthesisUtterance('Número de ticket ' + data.numeroTicket + " en el escritorio " + data.noEscritorio);
//     utterThis.lang = 'es';
//     // utterThis.rate = 0.6;
//     utterThis.voice = vozFemenina || null;
//     window.speechSynthesis.cancel();
//     synth.speak(utterThis);
//   };

//   // Verificar si las voces ya están disponibles
//   if (synth.getVoices().length !== 0) {
//     speakWhenVoicesReady();
//   } else {
//     // Esperar al evento 'voiceschanged' para saber cuándo las voces están listas
//     synth.onvoiceschanged = speakWhenVoicesReady;
//   }
// }


   dataListener = () => {
    console.log('Aqui');
    this.hubConnection.on('getTicketByUser', (data) => {
      this.data.length = 0;

      this.data = data.response;
      console.log(data, 'Aqui');
    });
  }

   executeData = (groupName:string,usuario: ICredencial | null): void => {
    this.hubConnection.invoke('getTicketByUser',groupName,usuario).catch(
      err => console.log('Error de invocación:' + err)
    );
  }


  leerCookieJson(){
    const cookieName = 'cookie_tickets';
    if (this.cookieService.check(cookieName)) {
      const cookieValue = this.cookieService.get(cookieName);
      try {
        this.miCookie = JSON.parse(cookieValue);
        console.log('Valor de la cookie:aa ', this.miCookie.config.codigoPad+"a");
      } catch (error) {
        console.error('Error al analizar la cookie JSON:', error);
      }
    }
  }
}
