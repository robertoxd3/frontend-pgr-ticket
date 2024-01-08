import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ColaService } from 'src/app/services/cola.service';
import { SrColaService } from 'src/app/services/sr-cola.service';
import { SrTransferirService } from 'src/app/services/sr-transferir.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css'],
  providers:[DatePipe,MessageService]
})
export class TransferirComponent implements OnInit{
unidades?:any[];
selectedUnidad!: any;
unidadActual!:any;
usuarioLogueado:any;
formTrasnferencia!: FormGroup;
loading:boolean=false;
@Input() usuario: any;
@Input() data:any;

  constructor( public activeModal: NgbActiveModal,private srTransferir:SrTransferirService,private srCola:SrColaService,private signalRService:ColaService , private messageService:MessageService, public datePipe:DatePipe, private ticketService:TicketService, private fb:FormBuilder){

  }

  close(): void {
    this.activeModal.close({
      // success: false,
      // data: ''
    });
  }
  ngOnInit(): void {
    this.usuarioLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    this.obtenerUnidades();
    this.createForms();
    console.log(this.data);
  }

  obtenerUnidades() {
    if(this.usuario!=null){
      this.ticketService.getUnidadesUser(this.usuario).subscribe({
        next: (res) => {
          console.log(res);
          this.unidades = res;
          const result = res?.find((x:any) => {
            return x.codigoUnidades === this.usuarioLogueado.codigoUnidad;
          });
          this.unidadActual=result;
        },
        error: (err) => {
          this.showAlert('No se pudo obtener configuración del JSON','Error','error');
        }, 
      });
   

    } 
  }

  showAlert(mensaje: string, titulo:string, tipo: string) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: mensaje,
    });
  }
  
  createForms(){
    this.formTrasnferencia = this.fb.group({
      IdOrden: 0,
      CodigoUnidadRedirigir: '', 
    });
  }

  guardar(){
 
    if(this.selectedUnidad===this.unidadActual.codigoUnidades){
      this.showAlert('No se puede transferir a la Misma Unidad','Error','error');
    }else{
      console.log(this.data.idOrden);
      console.log(this.selectedUnidad);
      this.formTrasnferencia.value.IdOrden=this.data.idOrden;
      this.formTrasnferencia.value.CodigoUnidadRedirigir=this.selectedUnidad;
          this.ticketService.TransferirTicket(this.formTrasnferencia.value).subscribe({
            next: (res) => {
              console.log(res);
              console.log(this.usuario.codigoPad+ this.usuarioLogueado.codigoUnidad);
              this.signalRService.UpdateUltimoTicket(this.usuarioLogueado.codigoUsuario);
              this.srTransferir.UpdateTransferidos(this.selectedUnidad, this.selectedUnidad);
              if(res)
                this.close();
              else
              this.showAlert('Fallo al transferir','Error','error');
            },
            error: (err) => {
              console.log(err.error);
              this.showAlert(err.error,"Error","error");
            }, 
          });
        } 
    }

}
