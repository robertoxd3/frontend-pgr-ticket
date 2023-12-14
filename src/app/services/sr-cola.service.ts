import { Injectable } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { ICredencial } from '../model/credencial.interface';
import { environment } from 'src/environments/environment';
import { SignalrClass } from './Functions/SingalRclass';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificacionModalComponent } from '../components/notificacion-modal/notificacion-modal.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SrColaService  {
  public recommendedVoices?: any;
  public dataSubject: Subject<any> = new Subject<any>();
  public transferidosDataSubject: Subject<any> = new Subject<any>();
  public notificationDataSubject = new Subject<any>();
  notificationData=this.notificationDataSubject.asObservable();
  voices: SpeechSynthesisVoice[] = [];
  constructor(private cookieService:CookieService, private modalService:DialogService) {
    this.leerCookieJson();
    // setTimeout(() => {
    //   const synth = window.speechSynthesis;
    //     this.recommendedVoices = synth.getVoices();
    // }, 500);
    // console.log("a a "+this.recommendedVoices);
      this.loadVoices();
   }
  private miCookie:any;
  private data:any;
  private hubConnection!: SignalR.HubConnection;

  public startConnection = (): void => {
    const usuario: ICredencial = JSON.parse(localStorage.getItem('user')|| '{}');
    const url: string =  environment.colaWebSocket2;
    
    this.hubConnection = SignalrClass.buildConnection(url, usuario);

    this.hubConnection.start().then((): void => {
      //const group = 'svl' + usuario.usercodigo;
      const group = this.miCookie.config.codigoPad;
      this.hubConnection.invoke('join', group).catch(
        err => console.log('Error de conexión:' + err)
      );

      this.receiveInitialData();
      //this.getTicketTransferencias();
    }).catch(
      err => console.log('Error de conexión al hub' + err)
    );
  }

  loadVoices() {
    const synth = window.speechSynthesis;

    // Obtener las voces cuando la página se cargue
    setTimeout(() => {
      this.voices = synth.getVoices();
     // console.log(this.voices);
    }, 1000); // Cambia el tiempo de espera si es necesario

    // También puedes usar el evento 'voiceschanged' para actualizar las voces
    synth.onvoiceschanged = () => {
      this.voices = synth.getVoices();
      //console.log(this.voices);
    };
  }


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
    .then(_ => console.log("Data Actualizada"));
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
  

   NotificationListener = (): void => {
    this.hubConnection.on('Notification', (data): void => {
      console.log(data);
      this.showNotificationModal(data);
      // return data;
      this.notificationDataSubject.next(data);
    });
  }

   executeNotification = (groupname: string | null, notification: any): void => {
   
    this.hubConnection.invoke('Notification', groupname,notification).catch(
        err => console.log('Error de invocación:' + err)
    );
}

showNotificationModal(datos: any): void {
  console.log(datos);
  const ref = this.modalService.open(NotificacionModalComponent, { 
    data: { notificacion: datos },
    width: '60%', 
    // height:'350px',
    // header: 'Llamada'
  });

  this.loadVoicesAndSpeak(datos);

  setInterval(() => {
    ref.close();
  }, 6000);

  ref.onClose.subscribe((result: any) => {
    console.log('Modal cerrado', result);
  });
}

loadVoicesAndSpeak(data: any): void {
  const synth = window.speechSynthesis;

  const speakWhenVoicesReady = () => {
    const recommendedVoices = synth.getVoices();
    console.log(recommendedVoices);

    const vozFemenina = recommendedVoices.find(voice => {
      return voice.lang === 'es-ES' && voice.name.includes('Femenino');
    });

    const utterThis = new SpeechSynthesisUtterance('Número de ticket ' + data.numeroTicket + " en el escritorio " + data.idEscritorio);
    utterThis.lang = 'es';
    utterThis.rate = 0.7;
    utterThis.voice = vozFemenina || null;

    synth.speak(utterThis);
  };

  // Verificar si las voces ya están disponibles
  if (synth.getVoices().length !== 0) {
    speakWhenVoicesReady();
  } else {
    // Esperar al evento 'voiceschanged' para saber cuándo las voces están listas
    synth.onvoiceschanged = speakWhenVoicesReady;
  }
}
synthesizeSpeechFromText(data: any) {
  const synth = window.speechSynthesis;

  const speakWhenVoicesReady = () => {
    const recommendedVoices = synth.getVoices();
    console.log(recommendedVoices);

    const vozFemenina = recommendedVoices.find(voice => {
      return voice.lang === 'es-ES' && voice.name.includes('Femenino');
    });

    const utterThis = new SpeechSynthesisUtterance('Número de ticket ' + data.numeroTicket + " en el escritorio " + data.idEscritorio);
    utterThis.lang = 'es';
    // utterThis.rate = 0.6;
    utterThis.voice = vozFemenina || null;
    window.speechSynthesis.cancel();
    synth.speak(utterThis);
  };

  // Verificar si las voces ya están disponibles
  if (synth.getVoices().length !== 0) {
    speakWhenVoicesReady();
  } else {
    // Esperar al evento 'voiceschanged' para saber cuándo las voces están listas
    synth.onvoiceschanged = speakWhenVoicesReady;
  }
}


   dataListener = () => {
    //this.initResumenData();
    console.log('Aqui');
    this.hubConnection.on('getTicketByUser', (data) => {
      this.data.length = 0;
      // if (data.statusCode === 200) {
      //   this.data = data.response;
      // }
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
        console.log('Valor de la cookie:aa ', this.miCookie.config.codigoPad);
      } catch (error) {
        console.error('Error al analizar la cookie JSON:', error);
      }
    }
  }
}
