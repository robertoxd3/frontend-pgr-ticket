import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('imgS') imgS!: ElementRef;
  @ViewChild('button') button!: ElementRef;
  constructor(private confirmationService:ConfirmationService){
    
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  ngOnInit() {

  }

  preview(event: Event,element:any,nombre: string){
    switch(nombre) { 
      case "facebook": {
          this.imgS.nativeElement.src="assets/facebook.jpeg";
          element.toggle(event);
         break; 
      } 
      case "twitter": { 
        this.imgS.nativeElement.src="assets/twitter.jpeg";
        element.toggle(event);
         break; 
      } 
      case "youtube": { 
      this.imgS.nativeElement.src="assets/youtube.jpeg";
       element.toggle(event);
        break; 
     } 
     case "instagram": { 
     this.imgS.nativeElement.src="assets/instagram.jpeg";
     element.toggle(event);
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
