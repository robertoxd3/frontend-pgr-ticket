import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

import { TicketService } from 'src/app/services/ticket.service';

export interface IDisponibilidad {
  IdProgramarIndiponibilidad?:number;
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
  Programados!:any[];
  selectedProgramados!: any;
  constructor( public activeModal: NgbActiveModal,private messageService:MessageService, public datePipe:DatePipe, private ticketService:TicketService, private fb:FormBuilder){
    this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    
    this.disponibilidadForm = this.fb.group({
      IdEscritorio: this.usuarioLogueado.idEscritorio,
      FechaInicio: ['',[Validators.required]],
      HorasNoDisponible: ['',[Validators.required]],
    });
    }

  ngOnInit(){
   this.obtenerProgramados();
  }

  showAlert(mensaje: string, titulo:string, tipo: string) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: mensaje,
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
        if(res.response){
          this.showAlert("Se programo la indisponibilidad con exito.","Exito","success");
          this.close();
        }else{
          this.showAlert("No se pudo programar la indisponibilidad","Error","error");
        }
        //this.close();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.showAlert("Error al conectarse","Error","error");
      }, 
    });
  }

  obtenerProgramados(){
    const body: IDisponibilidad = {
      IdEscritorio: this.usuarioLogueado.idEscritorio,
    }
    this.ticketService.ObtenerProgramados(body).subscribe({
      next: (res) => {
        console.log(res.response);
        this.Programados=res.response;
 
      },
      error: (err) => {
        console.log(err);
        this.showAlert("Error al conectarse","Error","error");
      }, 
    });
  }

  borrarProgramado(model:any){
    const body: IDisponibilidad = {
      IdProgramarIndiponibilidad: model.idProgramarIndiponibilidad,
      IdEscritorio: model.idEscritorio,
      FechaInicio: model.fechaInicio,
      HorasNoDisponible: model.horasNoDisponible
    }
    //console.log(body);
    this.ticketService.BorrarProgramado(body).subscribe({
      next: (res) => {
        console.log(res.response);
        this.obtenerProgramados();
      },
      error: (err) => {
        console.log(err);
        this.showAlert("Error al conectarse","Error","error");
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
