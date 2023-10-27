import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ColaService } from 'src/app/services/cola.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ejecutivo',
  templateUrl: './ejecutivo.component.html',
  styleUrls: ['./ejecutivo.component.css'],
  providers:[DatePipe]
})
export class EjecutivoComponent {
  displayModal: boolean = false;
selectedData: any;
products!: any[];
isloading:boolean=false;
selectedProduct!: any;
miCookie:any;
realTimeData: any;
realTimeData2:any;
first = 0;

rows = 10;

constructor(private signalRService: ColaService, private cookieService:CookieService,public datePipe: DatePipe) {
  this.leerCookieJson();
}

showModal(data: any) {
  console.log("Prueba")
    this.selectedData = data;
    this.displayModal = true;
}

closeModal() {
    this.displayModal = false;
}


ngOnInit() {
  this.signalRService.ngOnInit(this.miCookie.config.codigoPad);
  this.isloading=true;
  // this.signalRService.getDataUpdates().subscribe(data => {
  //       //this.realTimeData = data;
  //       //console.log(data);
  //      // this.isloading=false;
  // });
  this.signalRService.getTicketUpdates().subscribe(data => {
    
    this.realTimeData = data;
    console.log(data);
    this.isloading=false;
});
this.isloading=false;

}

onRowSelect(event: any) {
   //console.log("Seleccionado: "+ event.data.name);
   this.selectedData=event.data;
   this.displayModal = true;
  
}

reset(){
       if (this.signalRService.isConnectionEstablished()) {
      this.signalRService.UpdateTickets(this.miCookie.config.codigoPad);
  } else {
      console.error('La conexión SignalR no está establecida.');
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
