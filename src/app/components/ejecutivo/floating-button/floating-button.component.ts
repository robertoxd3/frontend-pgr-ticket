import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';
import { faFaceFrown,faFaceLaugh,faFaceMeh } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent implements OnInit {
  checked: boolean = true;
  loading: boolean = false;

  faFaceFrown=faFaceFrown;
  faFaceLaugh=faFaceLaugh;
  faFaceMeh=faFaceMeh;
  isMenuOpen = false;
  constructor(private _ticketService: TicketService, private messageService: MessageService){

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {}

showAlert(mensaje: string, titulo:string, tipo: string) {
  this.messageService.add({
    severity: tipo,
    summary: titulo,
    detail: mensaje,
  });
}

}
