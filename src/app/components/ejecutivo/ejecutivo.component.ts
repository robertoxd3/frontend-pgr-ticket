import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ColaService } from 'src/app/services/cola.service';
import { DatePipe } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthGuard } from 'src/app/auth.guard';
import { SrColaService } from 'src/app/services/sr-cola.service';

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
TicketFinalizados:any;
first = 0;
usuarioLogueado:any;
rows = 10;
formProcedimiento!: FormGroup;
formCambiarEstado!: FormGroup;
loading:Boolean=false;
itemsAvatar!: MenuItem[];
notificacion = {
  numeroTicket: "",
  escritorio: ""
}
checked:boolean=false;

constructor(private auth:AuthGuard,private srCola:SrColaService, private fb:FormBuilder, private signalRService: ColaService,private ticketService:TicketService,private cookieService:CookieService,public datePipe: DatePipe,public messageService:MessageService) {
  this.leerCookieJson();
  this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(this.usuarioLogueado);
  this.createForms();
  this.ticketService.obtenerEstadoEjecutivo(this.formProcedimiento.value).subscribe(res=>{
    this.checked=res
  });
  this.notificacion = {
    numeroTicket: "",
    escritorio: ""
  }

}

ngOnInit() {
  this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
  this.isloading=true;
  this.signalRService.getLastTicket().subscribe(data => {
    this.realTimeDataTurno = data;
  });
  this.signalRService.getTicketUpdates().subscribe(data => {
    this.realTimeData = data;
    console.log(data);
  });
  this.ticketService.ObtenerTicketFinalizados(this.formProcedimiento.value).subscribe(data => {
    this.TicketFinalizados = data;
  });
  this.signalRService.receiveLastTicket();
//  this.signalRService.NotificationListener(); 

 setTimeout(() => {
  this.signalRService.UpdateColaEjecutivo(this.miCookie.config.codigoPad);
  this.signalRService.UpdateCola(this.miCookie.config.codigoPad);
  this.signalRService.UpdateUltimoTicket(this.miCookie.config.codigoPad);
 }, 600);
  this.isloading=false;
  // this.srCola.startConnection();
  // this.srCola.dataListener();

}

ngOnDestroy(): void {
  this.signalRService.disconnect();
}

Logout(){
  this.auth.logout();
}

onRowSelect(event: any) {
   this.selectedData=event.data;
   this.displayModal = true;
}

cambiarEstado(){
  console.log(this.checked);
  // if(this.checked==true && this.realTimeDataTurno[0]){
  this.formCambiarEstado.value.estado=this.checked;
    this.ticketService.cambiarEstadoEjecutivo(this.formCambiarEstado.value).subscribe({
      next: (res) => {
        console.log(res);
        this.update();
      },
      error: (err) => {
        console.log(err);
      }, 
    })
  // }else{
  //   console.log('Paso');
  //   this.checked=!this.checked;
  //   this.showAlert('Debe de finalizar el turno actual','Error','error');
  // }
}

update(){
       if (this.signalRService.isConnectionEstablished()) {
      this.signalRService.UpdateColaEjecutivo(this.miCookie.config.codigoPad);
      this.signalRService.UpdateCola(this.miCookie.config.codigoPad);
      this.signalRService.UpdateUltimoTicket(this.miCookie.config.codigoPad);
      this.ticketService.ObtenerTicketFinalizados(this.formProcedimiento.value).subscribe(data => {
        this.TicketFinalizados = data;
      });
  } else {
      console.error('La conexión SignalR no está establecida.');
  }
}

createForms() {
  this.formProcedimiento = this.fb.group({
    codigoUsuario: this.usuarioLogueado.codigoUsuario,
    idEscritorio: this.usuarioLogueado.idEscritorio, 
    idTipo:"3",
  });
  this.formCambiarEstado = this.fb.group({
    codigoUsuario: this.usuarioLogueado.codigoUsuario,
    estado: false,
  });
}

Llamada(id:any){
  this.loading=true;
  console.log(id);
  this.formProcedimiento.value.idTipo=id;

 if (this.usuarioLogueado) {
      this.ticketService.procedimientoAlmacenado(this.formProcedimiento.value).subscribe({
        next: (res) => {
          console.log(res);
          this.update();
          if(id==1){
            this.showAlert("Se llamo al usuario con exito","Exito","success");
            this.call(res[0].numeroTicket);
          }
          else if(id==2)
          this.showAlert("Se Finalizo turno con exito","Exito","success");
          else if(id==3){
            this.showAlert("Se volvio a llamar al usuario con exito","Exito","success");
            this.call(res[0].numeroTicket);
          }

          this.loading = false;
        },
        error: (err) => {
          console.log(err.error);
          this.showAlert(err.error,"Error","error");
          this.update();
          this.loading = false;
        }, 
      });
    } 
    else 
      console.error('La conexión SignalR no está establecida.');
  } 

  showAlert(mensaje: string, titulo:string, tipo: string) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: mensaje,
    });
  }

  call(numeroTicket:any){
    try {
      this.notificacion.numeroTicket=numeroTicket;
      this.notificacion.escritorio=""+this.usuarioLogueado.idEscritorio;
      this.signalRService.executeNotification(this.miCookie.config.codigoPad,this.notificacion);
    } catch (error) {
      //console.log(error);
      this.showAlert("No hay ticket atendiendo para llamar","Error","error");

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



