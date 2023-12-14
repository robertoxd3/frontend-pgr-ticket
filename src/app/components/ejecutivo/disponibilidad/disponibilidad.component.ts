import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css'],
  providers:[MessageService,DatePipe]
})
export class DisponibilidadComponent implements OnInit{
  disponibilidadForm: FormGroup;
  loading:boolean=false;
  constructor( public activeModal: NgbActiveModal,private messageService:MessageService, public datePipe:DatePipe, private ticketService:TicketService, private fb:FormBuilder){
      this.disponibilidadForm = this.fb.group({
        IdEscritorio: [''],
        FechaInicio: ['', [Validators.required]],
        HorasNoDisponible: ['',[Validators.required]],
      });
    }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this.loading=true;
    this.ticketService.ProgramarDisponibilidad(this.disponibilidadForm.value).subscribe({
      next: (res) => {
        console.log(res.response);
      
        //this.close();
        this.loading = false;
      },
      error: (err) => {
        console.log("Error: "+err);
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
