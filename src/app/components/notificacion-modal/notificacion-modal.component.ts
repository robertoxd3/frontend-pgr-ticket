import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-notificacion-modal',
  templateUrl: './notificacion-modal.component.html',
  styleUrls: ['./notificacion-modal.component.css'],
  providers: [DialogService]
})
export class NotificacionModalComponent implements OnInit {
  notificationData: any=[];
  ref: DynamicDialogRef | undefined;


  constructor(public dialogRef: DynamicDialogRef,public config: DynamicDialogConfig) { 
    console.log(JSON.stringify(config.data.notificacion));
    this.notificationData=config.data.notificacion;
  }

  ngOnInit(): void {
    
  }

  close(): void {

      this.dialogRef.close();
  
  }
}
