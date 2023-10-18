import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css'],
  providers:[ConfirmationService],
})
export class SocialMediaComponent implements OnInit{

  sidebarVisible:boolean=false;
  sidebarVisibleDenuncia: boolean=false;
  isMenuOpen = false;
  
  constructor(private confirmationService:ConfirmationService){
    
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  ngOnInit() {

  }

  preview(event: Event,nombre: string){
    switch(nombre) { 
      case "facebook": {
          this.confirmationService.confirm({
              target: event.target as EventTarget,
              message: 'Are you sure that you want to proceed?',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
              },
              reject: () => {
                  //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
              }
          });
         break; 
      } 
      case "twitter": { 
        console.log(2)
         break; 
      } 
      case "youtube": { 
       console.log(3)
        break; 
     } 
     case "instagram": { 
     console.log(4)
      break; 
   } 
      default: { 
         //statements; 
         break; 
      } 
   }
  }

  toggleMenuContacto() {
    this.sidebarVisible = !this.sidebarVisible;
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleMenuDenuncia(){
    this.sidebarVisibleDenuncia=!this.sidebarVisibleDenuncia;
    this.isMenuOpen = !this.isMenuOpen;
    }

    SocialMedia = [
      {icon: "pi pi-facebook", title: 'Centro de llamadas', nombreSimple:"facebook"},
      {icon: "pi pi-twitter", title: "WhatsApp", nombreSimple:"twitter"},
      {icon: "pi pi-instagram", title: "Correo electrónico", nombreSimple:"instagram"},
      {icon: "pi pi-youtube", title: "Sitio Web PGR",nombreSimple:"youtube"},
    ];
}
