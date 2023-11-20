import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ColaService } from 'src/app/services/cola.service';
import { DatePipe } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthGuard } from 'src/app/auth.guard';

@Component({
  selector: 'app-ejecutivo',
  templateUrl: './ejecutivo.component.html',
  styleUrls: ['./ejecutivo.component.css'],
  providers:[DatePipe,MessageService]
})
export class EjecutivoComponent {
  displayModal: boolean = false;
selectedData: any;
products!: any[];
isloading:boolean=false;
selectedProduct!: any;
miCookie:any;
realTimeData: any;
realTimeDataTurno:any;
first = 0;
usuarioLogueado:any;
rows = 10;
formProcedimiento!: FormGroup;
loading:Boolean=false;
itemsAvatar!: MenuItem[];
notificacion = {
  numeroTicket: 'X-198',
  escritorio: '1'
}

constructor(private auth:AuthGuard, private fb:FormBuilder, private signalRService: ColaService,private ticketService:TicketService,private cookieService:CookieService,public datePipe: DatePipe,public messageService:MessageService) {
  this.leerCookieJson();
  this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(this.usuarioLogueado);
  this.createForm();
  this.itemsAvatar = [
    {
        label: 'Cerrar Sesión',
        icon: 'pi pi-refresh',
        command: () => {
            this.Logout();
        }
    },
];
}


showModal(data: any) {
  console.log("Prueba")
    this.selectedData = data;
    this.displayModal = true;
}

Logout(){
  this.auth.logout();

}

closeModal() {
    this.displayModal = false;
}


ngOnInit() {
  this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
  this.isloading=true;
  this.signalRService.getDataUpdates().subscribe(data => {
        this.realTimeDataTurno = data;
        console.log(data);
  });
  this.signalRService.getTicketUpdates().subscribe(data => {
    this.realTimeData = data;
    console.log(data);
  });
  this.signalRService.UpdateColaEjecutivo(this.miCookie.config.codigoPad);
  this.signalRService.addTicketListener();
 this.signalRService.NotificationListener(); 
this.isloading=false;
 
}

ngOnDestroy(): void {
  this.signalRService.disconnect();
}

onRowSelect(event: any) {
   //console.log("Seleccionado: "+ event.data.name);
   this.selectedData=event.data;
   this.displayModal = true;
  
}

reset(){
       if (this.signalRService.isConnectionEstablished()) {
      this.signalRService.UpdateColaEjecutivo(this.miCookie.config.codigoPad);
      this.signalRService.UpdateCola(this.miCookie.config.codigoPad);
  } else {
      console.error('La conexión SignalR no está establecida.');
  }
}

createForm() {
  this.formProcedimiento = this.fb.group({
    codigoUsuario: this.usuarioLogueado.codigoUsuario,
    idEscritorio: this.usuarioLogueado.idEscritorio, 
    idTipo:"3",
  });
}
// Como mostrar un modal con datos en tiempo real enviado a otro componente angular que estan conectado en el mismo web socket de singal r en .net web api 
Llamada(id:any){
  this.loading=true;
  console.log(id);
  this.formProcedimiento.value.idTipo=id;
  //console.log("idTipo: "+ this.formProcedimiento.value.idTipo);
 if (this.usuarioLogueado) {
      this.ticketService.procedimientoAlmacenado(this.formProcedimiento.value).subscribe({
        next: (res) => {
          console.log(res);
          //this.signalRService.executeNotification(this.miCookie.config.codigoPad,this.notificacion);
          if(id==1)
            this.showAlert("Se llamo al usuario con exito","Exito","success");
          else if(id==2)
          this.showAlert("Se Finalizo turno con exito","Exito","success");
          else if(id==3)
          this.showAlert("Se volvio a llamar al usuario con exito","Exito","success");

          this.loading = false;
        },
        error: (err) => {
          console.log(err.error);
          this.showAlert(err.error,"Error","error");
          
          this.loading = false;
        }, 
      });
    } 
    else 
      console.error('La conexión SignalR no está establecida.');
  } 

//   sendNotification(notification:any)
// {
//   this.signalRService.subscribeToNotification(notification);
// }

  showAlert(mensaje: string, titulo:string, tipo: string) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: mensaje,
    });
  }

  call(){
    this.signalRService.executeNotification(this.miCookie.config.codigoPad,this.notificacion);
    console.log("call");
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



