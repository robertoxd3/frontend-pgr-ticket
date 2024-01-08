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
  minDate!:Date;
  banderaAccion: number=0;
  activeIndex:number=0;
  constructor( public activeModal: NgbActiveModal,private messageService:MessageService, public datePipe:DatePipe, private ticketService:TicketService, private fb:FormBuilder){
    this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    
    this.disponibilidadForm = this.fb.group({
      IdProgramarIndiponibilidad: null,
      IdEscritorio: this.usuarioLogueado.idEscritorio,
      FechaInicio: ['',[Validators.required]],
      HorasNoDisponible: [null,[Validators.required]],
    });
    //this.minDate = new Date();
    
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
    if(this.banderaAccion==0){
     
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
    }else{
      this.updateProgramado()
    }
   
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
        console.log(res);
        this.obtenerProgramados();
      },
      error: (err) => {
        console.log(err);
        this.obtenerProgramados();
        //this.showAlert("Error al conectarse","Error","error");
      }, 
    });
  }

  modificarProgramado(model:any){
   this.activeIndex=0;
   this.disponibilidadForm.value.IdProgramarIndiponibilidad=model.idProgramarIndiponibilidad;
   var fechaprueba= new Date(model.fechaInicio);
   this.disponibilidadForm.get('IdProgramarIndiponibilidad')?.setValue(model.idProgramarIndiponibilidad);
   this.disponibilidadForm.get('IdEscritorio')?.setValue(model.idEscritorio);
   this.disponibilidadForm.get('FechaInicio')?.setValue(fechaprueba);
   this.disponibilidadForm.get('HorasNoDisponible')?.setValue(model.horasNoDisponible);
   this.banderaAccion=1;
  }

  crearNuevo(){
    this.disponibilidadForm.reset();
    this.banderaAccion=0;
  }

  updateProgramado(){
    const body: IDisponibilidad = {
      IdProgramarIndiponibilidad: this.disponibilidadForm.value.IdProgramarIndiponibilidad,
      IdEscritorio: this.usuarioLogueado.idEscritorio,
      FechaInicio: this.disponibilidadForm.value.FechaInicio,
      HorasNoDisponible: this.disponibilidadForm.value.HorasNoDisponible
    }
   // console.log('MOdificando');
    this.ticketService.ModificarProgramado(body).subscribe({
      next: (res) => {
        console.log(res);
        this.obtenerProgramados();
        this.crearNuevo();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.obtenerProgramados();
        this.crearNuevo();
        this.loading = false;
        //this.showAlert("Error al conectarse","Error","error");
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
