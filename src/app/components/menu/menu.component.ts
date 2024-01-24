import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';
import { CookieService } from 'ngx-cookie-service';
import { ColaService } from 'src/app/services/cola.service';
import { Subscription } from 'rxjs';
import { SrColaService } from 'src/app/services/sr-cola.service';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


//declare var VerificarPrint:any;
declare var PrintInfoDenucia:any;
declare var PrintInfoContacto:any;
declare var PrintReceipt:any;

//
declare var setPosId:any;
declare var setCharacterset:any;
declare var printText:any;
declare var cutPaper:any;
declare var getPosData:any;
declare var requestPrint:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MessageService]
})
export class MenuComponent implements OnInit,OnDestroy {
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
  banderaBixolon!:boolean;
  sidebarVisibleDenuncia:boolean=false;
  localConexion:any;
  conexionBixolon:any;
  items: MenuItem[] | undefined;
  activeIndex: number = 0;
  private dataSubscription: Subscription | undefined;
  constructor(private _ticketService: TicketService,private srCola:SrColaService,private modalService:NgbModal,private signalRService: ColaService, private fb: FormBuilder, private messageService: MessageService,private cookieService: CookieService) {
    this.conexionBixolon=null;
  }

  ngOnInit(): void {
    //this.leerJson();
    this.leerCookieJson();
    this.createForm();
    this.obtenerUnidades();
    this.getTipoFilas();
    console.log(this.infoButton);
    this.srCola.startConnection(this.miCookie.config.codigoPad);
    this.banderaBixolon=true;

    setInterval(() => {
      if (this.srCola.isConnectionEstablished()){
        console.log('connectado WebSocket...');
      }else{
        console.log('Connexion Perdida');
        window.location.reload();
      }
    }, 30000*1);
    
  }
  ngOnDestroy(): void {
    this.signalRService.disconnect();
  }
ActualizarTicketPantallas(){
  this.srCola.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
}


VerificarPrint(){
  console.log('Pasando por verificarPrint');
  var issueID2 = 1;
  setPosId(issueID2);

  setCharacterset(1252);
  printText("\n", 0, 0, false, false, false, 0, 1);
  cutPaper(1);
  var strSubmit = getPosData();
  console.log(strSubmit);
  issueID2++;
  requestPrint("Printer1", strSubmit, this.viewResult);
  return true;
}

 viewResult(result:any) {
  localStorage.setItem("conexion", JSON.stringify(result));

  console.log(result);
  return result;
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
//Obtiene la ultima letra de un string
  public obtenerUltimaLetra(codigoUnidad: string){
    const partes: string[] = codigoUnidad.split(".");
    const ultimoValor: string = partes[partes.length - 1];
    const ultimoDigito: number = parseInt(ultimoValor.charAt(0));
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
    this.showDialog();
    this.selectedNombreSimple=nombreSimple;
    this.selectedCodigoUnidad=codigoUnidad.trim();
    this.formGroup.patchValue({codigoUnidad: this.selectedCodigoUnidad});
    if(this.mostrarTipoFila){
      //this.showDialog();
      console.log("if Mostrar codUnidad:"+ codigoUnidad.trim());
    }else{
      //api de crear ticket en lugar que el json configurado tenga false el mostrar el tipo de fila aca de un 
      //solo genera el ticket con idfila 2 de no aplica
      
      console.log("codUnidad:"+ codigoUnidad.trim());
      this.formGroup.value.codigoUnidad= this.selectedCodigoUnidad;
      this.formGroup.value.idFila= 2;
      this.almacenarTicket();
     
    }
  }

  // openSteps(){
  //   const dialogRefBs = this.modalService.open(StepsComponent,
  //     { ariaLabelledBy: "modal-basic-title", size: "xl", centered: true });
  //     dialogRefBs.componentInstance.data = this.miCookie;
  // }


  onActiveIndexChange(event: number) {
      this.activeIndex = event;
  }

  
  almacenarTicket(){
    
    this.loading=true;
    if(this.miCookie){
 
       this.VerificarPrint();

       setTimeout(() => {
        var conexionBixolon= localStorage.getItem('conexion') || '{}';
        console.log(conexionBixolon);
        if(conexionBixolon?.includes('error')){
         this.showAlert('Verifique la conexion con la impresora bixolon','Error','error')
         }else{
          console.log('Paso a imprimir');
          this._ticketService.guardarTicket(this.formGroup.value,this.miCookie).subscribe({
            next: (res) => {
              console.log(res);
              if(res.status==400){          
                //this.showAlert(res.message,"Error",'error');
              }else{
                PrintReceipt(res.response.numeroTicket,res.response.fechaTicket,res.response.nombreSimple,res.response.departamento);
              }
             
              //this.actualizarTicketEjecutivo();
              this.ActualizarTicketPantallas();
         
                this.loading=false;
                if(res.status==400){          
                  this.showAlert(res.message,"Error",'error');
                }
                else{
                  if(res.statusDescription!='OK'){
    
                    this.showAlert("Ticket Creado Correctamente, Se estima que el unico encargado regrese a las "+res.statusDescription,"Exito",'success');
                    this.srCola.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
                  }else{
                    this.showAlert("Ticket Creado Correctamente","Exito",'success');
                    this.srCola.UpdateCola(this.miCookie.config.codigoPad,this.miCookie.config.idPad);
                  }
                }
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              this.showAlert("Error al conectar al servidor","Error",'error');
            },
          });
         }
       }, 500);
    }
  }

  // firstFormGroup = this.fb.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this.fb.group({
  //   secondCtrl: ['', Validators.required],
  // });
  // isLinear = false;

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
    try {
      if(PrintInfoContacto())
      this.showAlert("Ticket Creado Correctamente","Exito",'success');
      else
      this.showAlert("Problema al generar el ticket","Error",'error');
    } catch (error) {
      this.showAlert("Problema al conectar con Impresora","Error",'error');
      console.log(error);
    }   
    }

  
    imprimirInfoDenuncias(){
      try {
        if(PrintInfoDenucia())
        this.showAlert("Ticket Creado Correctamente","Exito",'success');
        else
        this.showAlert("Problema al generar el ticket","Error",'error');
      } catch (error) {
        this.showAlert("Problema al conectar con Impresora","Error",'error');
        console.log(error);
      }   
    }
   
}
