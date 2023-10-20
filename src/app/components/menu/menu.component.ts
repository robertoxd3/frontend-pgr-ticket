import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';
import { CookieService } from 'ngx-cookie-service';

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
  jsonContent: any;
  miCookie: any;
  isFinishedLoading:boolean=false;
  sidebarVisible:boolean=false;
  sidebarVisibleDenuncia:boolean=false;

  constructor(private _ticketService: TicketService, private fb: FormBuilder, private messageService: MessageService,private cookieService: CookieService) {
    
  }

  ngOnInit(): void {
    //this.leerJson();
    this.leerCookieJson();
    this.createForm();
    this.obtenerUnidades();
    this.getTipoFilas();
    console.log(this.infoButton);
  }

  leerCookieJson(){
    const cookieName = 'cookie_tickets';
    // Verifica si la cookie existe
    if (this.cookieService.check(cookieName)) {
      const cookieValue = this.cookieService.get(cookieName);
      try {
        this.miCookie = JSON.parse(cookieValue);
        console.log('Valor de la cookie:', this.miCookie);
        this.mostrarTipoFila = this.miCookie.config.mostrarTipoFila;
        //this.loadJsonToBackend(this.miCookie);
      } catch (error) {
        console.error('Error al analizar la cookie JSON:', error);
      }
    }
  }

  //Obtiene las unidades consumiendo la api y las asigna a la variable unidades que se muestra en pantalla
   obtenerUnidades() {
    if(this.miCookie!=null){
      this.loading=true;

      this._ticketService.getUnidades(this.miCookie).subscribe({
        next: (res) => {
          console.log(res);
          this.unidades = res;
          this.loading = false;
        },
        error: (err) => {
          //console.log(err);
          this.showAlert('No se pudo obtener configuración del JSON','Error','error');
          this.loading = false;
        }, 
      });
    } 
    
  }

  public obtenerUltimaLetra(codigoUnidad: string){
    const partes: string[] = codigoUnidad.split(".");
    const ultimoValor: string = partes[partes.length - 1];
    const ultimoDigito: number = parseInt(ultimoValor.charAt(0));
    //console.log("UltimoDigito: "+ultimoDigito + "\nUltimo Valor: "+ultimoValor); 
    if(ultimoDigito==parseInt(ultimoValor))
      return "assets/"+ultimoValor.trim()+".png";
     else
      return "assets/"+ultimoDigito.toString().trim()+".png";
  }

  //Obtiene los tipo de fila por medio de la api al backend
  getTipoFilas() {
    this._ticketService.getTipoFila().subscribe({
      next: (res) => {
        //console.log(res);
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
    if(this.miCookie){
      this._ticketService.guardarTicket(this.formGroup.value,this.miCookie).subscribe({
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

  infoButton=[
    {icon: "pi pi-facebook", nombreSimple: "QUEJAS Y DENUNCIAS"},
    {icon: "pi pi-facebook", nombreSimple: "ATENCIÓN VIRTUAL"}
  ];

  toggleMenuContacto() {
    this.sidebarVisible = !this.sidebarVisible;
    
  }
  toggleMenuDenuncia(){
    this.sidebarVisibleDenuncia=!this.sidebarVisibleDenuncia;
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
   
}
