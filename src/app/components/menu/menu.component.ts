import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MessageService]
})
export class MenuComponent implements OnInit {
  loading: boolean = false;
  unidades: any = [];
  visible: boolean = false;
  mostrarTipoFila: boolean=false;
  filas: any=[];
  formGroup!: FormGroup;
  selectedCodigoUnidad: any="";
  selectedNombreSimple: any="";
  selectedIdFila:any=0;
  clickCount: any=0;

  constructor(private _ticketService: TicketService, private fb: FormBuilder, private messageService: MessageService) {
    this.obtenerUnidades();
    this.getTipoFilas();
  }

  ngOnInit(): void {
    this.leerJson();
    this.createForm();
  }

  //Obtiene las unidades consumiendo la api y las asigna a la variable unidades que se muestra en pantalla
  obtenerUnidades() {
    this.loading=true;
    this._ticketService.getUnidades().subscribe({
      next: (res) => {
        console.log(res);
        this.unidades = res;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  //Obtiene la configuración del JSON por medio de una API al backend 
  leerJson() {
    this._ticketService.getJson().subscribe({
      next: (res) => {
        console.log(res);
        this.mostrarTipoFila = res.config.mostrarTipoFila;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  //Obtiene los tipo de fila por medio de la api al backend
  getTipoFilas() {
    this._ticketService.getTipoFila().subscribe({
      next: (res) => {
        console.log(res);
        //console.log("IdFila: "+res[0].idFila+" Nombre: "+res[0].nombreFila);
        this.filas=res;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  
  CrearTicketTipoFila(){
    if(this.formGroup.valid){
      console.log("Unidad: "+this.selectedCodigoUnidad+" idFila : "+this.formGroup.value.idFila);
      this.almacenarTicket();
      this.visible=false;
    } else{
      this.showAlert("Debe seleccionar un tipo de fila.","Validación",'error');
    }
  }

  mostrarDialog(codigoUnidad: string, nombreSimple: string){
    this.selectedNombreSimple=nombreSimple;
    this.selectedCodigoUnidad=codigoUnidad.trim();
    this.formGroup.patchValue({codigoUnidad: this.selectedCodigoUnidad});
    if(this.mostrarTipoFila){
      this.showDialog();
      console.log("codUnidad:"+ codigoUnidad.trim());
    }else{
      //api de crear ticket en lugar que el json configurado tenga false el mostrar el tipo de fila aca de un 
      //solo genera el ticket con idfila 2 de no aplica
      console.log("codUnidad:"+ codigoUnidad.trim());
      this.formGroup.value.codigoUnidad= this.selectedCodigoUnidad;
      this.formGroup.value.idFila= 2;
      this.almacenarTicket();
     
    }
  }

  
  //Envia al backend el formGroup que Incluye el codigoUnidad + el idFila y en el backend ejecuta el procedimiento almacenado.
  almacenarTicket(){
    this.loading=true;
    this._ticketService.guardarTicket(this.formGroup.value).subscribe({
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

  createForm() {
    this.formGroup = this.fb.group({
      codigoUnidad: new FormControl({ value: '', disabled: false }, Validators.required),
      idFila: new FormControl({ value: '', disabled: false }, Validators.required),
    });
  }

  showDialog() {
    this.visible = true;
}
  openLink(link: string){
    window.open(link, '_blank');
  }

  showAlert(mensaje: string, titulo:string, tipo: string) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: mensaje,
    });
  }

   printRequisitos() {
    var nombre="prueba";
    var contenidoTicket = "<table style='width: 100%; border-collapse: collapse; border-style: double; height: 605px;' border='1'><tbody><tr style='height: 238px;'><td style='width: 100%; height: 238px;'><h4 style='text-align: center;'><img style='display: block; margin-left: auto; margin-right: auto;' src='http://www.pgr.gob.sv/images/logo-pgr-marzo-2021.png' alt='LOGO' width='133' height='145' /><strong>REQUISITOS MINIMOS PARA EL TIPO DE CASO:</strong></h4><h3 style='text-align: center;'>" + nombre+"</tr></tbody></table>";
    var newWin = window.open('', 'Print-Window');
    //window.print();
    newWin?.document.open();
    newWin?.document.write('<html><body onload="window.print()">' + contenidoTicket + '</body></html>');
    newWin?.document.close();
    setTimeout(function () {
        newWin?.close();
    }, 10);

}


  Links = [
    {icon: "pi pi-facebook", link: "https://www.facebook.com/pgrelsalvadoroficial"},
    {icon: "pi pi-twitter", link: "https://twitter.com/PGR_SV"},
    {icon: "pi pi-whatsapp", link: "https://web.whatsapp.com/send?phone=50376079013&text&app_absent=0"},
    {icon: "pi pi-instagram", link: "https://www.instagram.com/pgr_sv/"},
    {icon: "pi pi-youtube", link: "https://www.youtube.com/channel/UCMRLTmvylbsc04T-Dp1Wh-g"},
  ];
   
}
