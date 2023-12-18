import { Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ColaService } from 'src/app/services/cola.service';
import { DatePipe } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthGuard } from 'src/app/auth.guard';
import { SrColaService } from 'src/app/services/sr-cola.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { TransferirComponent } from './transferir/transferir.component';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';
import { SrTransferirService } from 'src/app/services/sr-transferir.service';

@Component({
  selector: 'app-ejecutivo',
  templateUrl: './ejecutivo.component.html',
  styleUrls: ['./ejecutivo.component.css'],
  providers:[DatePipe,MessageService]
})
export class EjecutivoComponent {
  displayModal: boolean = false;
selectedData: any;
unidades!: any;
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
  idEscritorio: ""
}
items!: MenuItem[];
ticketsTransferidos:any;
checked:boolean=false;
@ViewChild('toggle') btnToggle!: ElementRef;
botonRellamada:boolean=false;

constructor(private auth:AuthGuard,private modalService:NgbModal,private srCola:SrColaService,private srTransferido:SrTransferirService,private _ticketService:TicketService, private fb:FormBuilder, private signalRService: ColaService,private ticketService:TicketService,private cookieService:CookieService,public datePipe: DatePipe,public messageService:MessageService) {
  this.leerCookieJson();
  this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(this.usuarioLogueado);
  this.createForms();
  this.ticketService.obtenerEstadoEjecutivo(this.formProcedimiento.value).subscribe(res=>{
    this.checked=res

    // this.btnToggle.nativeElement=true;
  });
  this.notificacion = {
    numeroTicket: "",
    idEscritorio: ""
  }

}

ngOnInit() {
  this.signalRService.ngOnInit(this.usuarioLogueado.codigoUsuario);
  this.isloading=true;
  this.signalRService.getLastTicket().subscribe(data => {
    this.realTimeDataTurno = data;
    //validar toggleButton 
    if(this.realTimeDataTurno.length === 0){
      this.botonRellamada=false;
    } else{
      this.botonRellamada=true;
    }
  });
  this.signalRService.getTicketUpdates().subscribe(data => {
    this.realTimeData = data;
    console.log(data);
  });
  this.ticketService.ObtenerTicketFinalizados(this.formProcedimiento.value).subscribe(data => {
    this.TicketFinalizados = data;
  });
  this.signalRService.receiveLastTicket();
  this.srCola.startConnection();

  this.signalRService.getTransferidosDataUpdates().subscribe(data => {
   // console.log(data);
   // this.ticketsTransferidos=data;
  });

  this.srTransferido.startConnection(this.usuarioLogueado.codigoUnidad);
  this.srTransferido.getTransferidosDataUpdates().subscribe(data => {
    console.log(data);
    this.ticketsTransferidos=data;
  });
  this.srCola.getDataUpdates().subscribe(data => {
    console.log("SE CREO TICKET: "+data);
    this.signalRService.UpdateColaEjecutivo(this.usuarioLogueado.codigoUsuario);
    this.signalRService.UpdateUltimoTicket(this.usuarioLogueado.codigoUsuario);
    
    this.srTransferido.UpdateTransferidos(this.usuarioLogueado.codigoUnidad,this.usuarioLogueado.codigoUnidad);
  });
  

 setTimeout(() => {
  // this.signalRService.UpdateColaEjecutivo(this.usuarioLogueado.codigoUsuario);
  // this.signalRService.UpdateCola(this.usuarioLogueado.codigoUsuario);
  // this.signalRService.UpdateUltimoTicket(this.usuarioLogueado.codigoUsuario);
  this.update();
 }, 800);
 //this.cargarTicketTransferidos();
  this.isloading=false;

  this.items = [
    {
        tooltip: '15 minutos',
        tooltipPosition: 'left',
        icon: 'pi pi-pencil',
        command: () => {
            this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
    },
    {
        tooltip: '30 minutos',
        icon: 'pi pi-refresh',
        tooltipPosition: 'left',
        command: () => {
            this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
    },
    {
        tooltip: '1 Hora',
        icon: 'pi pi-trash',
        tooltipPosition: 'left',
        command: () => {
            this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
    },
];
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

cargarTicketTransferidos(){
  var formData = new FormData();
    formData.append('codigoUsuario', this.usuarioLogueado.codigoUsuario);
  this.ticketService.GetTransferidos(formData).subscribe({
    next: (res) => {
      console.log(res);
      this.ticketsTransferidos=res;
    },
    error: (err) => {
      console.log(err);
    }, 
  });
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
      this.signalRService.UpdateColaEjecutivo(this.usuarioLogueado.codigoUsuario);
      this.signalRService.UpdateCola(this.usuarioLogueado.codigoUsuario);
      this.signalRService.UpdateUltimoTicket(this.usuarioLogueado.codigoUsuario);
      this.ticketService.ObtenerTicketFinalizados(this.formProcedimiento.value).subscribe(data => {
        this.TicketFinalizados = data;
      });
      this.signalRService.UpdateTransferidos(this.usuarioLogueado.codigoUsuario,this.usuarioLogueado.codigoUnidad);
      this.srTransferido.UpdateTransferidos(this.usuarioLogueado.codigoUnidad,this.usuarioLogueado.codigoUnidad);
      this.srCola.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
  } else {
      this.signalRService.getLastTicket().subscribe(data => {
    this.realTimeDataTurno = data;
    //validar toggleButton 
    if(this.realTimeDataTurno.length === 0){
      this.botonRellamada=false;
    } else{
      this.botonRellamada=true;
    }
  });
  this.signalRService.getTicketUpdates().subscribe(data => {
    this.realTimeData = data;
    console.log(data);
  });
  this.ticketService.ObtenerTicketFinalizados(this.formProcedimiento.value).subscribe(data => {
    this.TicketFinalizados = data;
  });
      console.error('La conexión SignalR no está establecida..');
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
      this.notificacion.idEscritorio=""+this.usuarioLogueado.idEscritorio;
      console.log(this.notificacion.idEscritorio);
      // this.srCola.muteVideo();
      this.srCola.executeNotification(this.miCookie.config.codigoPad,this.notificacion);
      // this.srCola.unmuteVideo();
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

  openModalTransferir(turnoActual:any){
    console.log(this.miCookie);
    const dialogRefBs = this.modalService.open(TransferirComponent,
      { ariaLabelledBy: "modal-basic-title", size: "xl", centered: true });
      dialogRefBs.componentInstance.data = turnoActual[0];
      dialogRefBs.componentInstance.usuario = this.miCookie;
  }

  indisponibilidad(){
    console.log(this.miCookie);
    const dialogRefBs = this.modalService.open(DisponibilidadComponent,
      { ariaLabelledBy: "modal-basic-title", size: "xl", centered: true });
      dialogRefBs.componentInstance.usuario = this.miCookie;
  }

  

}



