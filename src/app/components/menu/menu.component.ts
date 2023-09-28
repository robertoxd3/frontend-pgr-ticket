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
  selectedIdFila:any=0;

  constructor(private _ticketService: TicketService, private fb: FormBuilder, private messageService: MessageService) {
    this.obtenerUnidades();
    this.getTipoFilas();
  }

  ngOnInit(): void {
    this.leerJson();
    this.createForm();
  }

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

  almacenarTicket(){
    this._ticketService.guardarTicket(this.formGroup.value).subscribe({
      next: (res) => {
        console.log(res);
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
      console.log("CREANDO TICKET True");
      this.almacenarTicket();
      this.showAlert("Ticket Creado Correctamente","Exito",'success');
      this.visible=false;
    } else{
      this.showAlert("Debe seleccionar un tipo de fila.","Validación",'error');
    }
  }

  mostrarDialog(codigoUnidad: string){
    this.selectedCodigoUnidad=codigoUnidad.trim();
    this.formGroup.patchValue({codigoUnidad: this.selectedCodigoUnidad});
    if(this.mostrarTipoFila){
      this.showDialog();
      console.log("codUnidad:"+ codigoUnidad.trim());
    }else{
      //api de crear ticket
      console.log("codUnidad:"+ codigoUnidad.trim());
      console.log("CREANDO TICKET FALSE");
      this.formGroup.value.codigoUnidad= this.selectedCodigoUnidad;
      this.formGroup.value.idFila= 2;
      this.almacenarTicket();
      this.showAlert("Ticket Creado Correctamente","Exito",'success');
    }
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

  Links = [
    {icon: "pi pi-facebook", link: "https://www.facebook.com/pgrelsalvadoroficial"},
    {icon: "pi pi-twitter", link: "https://twitter.com/PGR_SV"},
    {icon: "pi pi-whatsapp", link: "https://web.whatsapp.com/send?phone=50376079013&text&app_absent=0"},
    {icon: "pi pi-instagram", link: "https://www.instagram.com/pgr_sv/"},
    {icon: "pi pi-youtube", link: "https://www.youtube.com/channel/UCMRLTmvylbsc04T-Dp1Wh-g"},
  ];
   
}
