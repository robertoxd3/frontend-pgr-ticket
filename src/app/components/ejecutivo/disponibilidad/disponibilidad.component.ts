import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

import { TicketService } from 'src/app/services/ticket.service';

export interface IDisponibilidad {
  IdEscritorio?: number;
  FechaInicio?: string;
  HorasNoDisponible?: number;
}


@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css'],
  providers:[MessageService,DatePipe]
})
export class DisponibilidadComponent implements OnInit{
  disponibilidadForm!: FormGroup;
  loading:boolean=false;
  usuarioLogueado:any;
  constructor( public activeModal: NgbActiveModal,private messageService:MessageService, public datePipe:DatePipe, private ticketService:TicketService, private fb:FormBuilder){
    this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    
     
    }

  ngOnInit(){
    this.disponibilidadForm = this.fb.group({
      IdEscritorio: this.usuarioLogueado.idEscritorio,
      FechaInicio:[''],
      HorasNoDisponible: [''],
    });
  }

  onSubmit(){
    this.loading=true;
    const body: IDisponibilidad = {
      IdEscritorio: this.usuarioLogueado.idEscritorio,
      FechaInicio: this.disponibilidadForm.value.FechaInicio,
      HorasNoDisponible: this.disponibilidadForm.value.HorasNoDisponible,
    }
    this.ticketService.ProgramarDisponibilidad(body).subscribe({
      next: (res) => {
        console.log(res.response);
      
        //this.close();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        //this.showAlert("Credenciales Invalidas","Error de autenticación","error")
      }, 
    });
  }

  close(): void {
    this.activeModal.close({
      // success: false,
      // data: ''
    });
  }
}
