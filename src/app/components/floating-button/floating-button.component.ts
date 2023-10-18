import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent implements OnInit {
  checked: boolean = true;
  loading: boolean = false;
  sidebarVisible:boolean=false;
  items!: MenuItem[] ;
  sidebarVisibleDenuncia: boolean=false;
  constructor(private _ticketService: TicketService, private messageService: MessageService){

  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  ngOnInit() {
    
}

imprimirInfo(){
  this.loading=true;
    this._ticketService.printInfo().subscribe({
      next: (res) => {
        console.log(res);
        setTimeout(() => {
          this.loading=false;
          if(res)
          this.showAlert("Ticket Creado Correctamente","Exito",'success');
          else
          this.showAlert("Problema al generar el ticket","Error",'error');
        }, 2500);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.showAlert("Error al conectar al servidor","Error",'error');
      },
    });
}

imprimirInfoDenuncias(){
  this.loading=true;
    this._ticketService.printInfoDenucias().subscribe({
      next: (res) => {
        console.log(res);
        setTimeout(() => {
          this.loading=false;
          if(res)
          this.showAlert("Ticket Creado Correctamente","Exito",'success');
          else
          this.showAlert("Problema al generar el ticket","Error",'error');
        }, 2500);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.showAlert("Error al conectar al servidor","Error",'error');
      },
    });
}

showAlert(mensaje: string, titulo:string, tipo: string) {
  this.messageService.add({
    severity: tipo,
    summary: titulo,
    detail: mensaje,
  });
}

  toggleMenuContacto() {
    this.sidebarVisible = !this.sidebarVisible;
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleMenuDenuncia(){
    this.sidebarVisibleDenuncia=!this.sidebarVisibleDenuncia;
    this.isMenuOpen = !this.isMenuOpen;
    }
}
