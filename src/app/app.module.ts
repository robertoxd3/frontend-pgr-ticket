import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { FloatingButtonComponent } from './components/ejecutivo/floating-button/floating-button.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidebarModule } from 'primeng/sidebar';
import { SpeedDialModule } from 'primeng/speeddial';
import { SocialMediaComponent } from './components/menu/social-media/social-media.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LlamadoComponent } from './components/llamado/llamado.component';
import { TableModule } from 'primeng/table';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo.component';
import { TabViewModule } from 'primeng/tabview';
import { LoginComponent } from './components/login/login.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AvatarModule } from 'primeng/avatar';
import { NotificacionModalComponent } from './components/llamado/notificacion-modal/notificacion-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import {MatMenuModule} from '@angular/material/menu';
import { TransferirComponent } from './components/ejecutivo/transferir/transferir.component';
import { DisponibilidadComponent } from './components/ejecutivo/disponibilidad/disponibilidad.component';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FloatingButtonComponent,
    SocialMediaComponent,
    LlamadoComponent,
    EjecutivoComponent,
    LoginComponent,
    NotificacionModalComponent,
    TransferirComponent,
    DisponibilidadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    SelectButtonModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    MessagesModule,
    ToggleButtonModule,
    SidebarModule,
    SpeedDialModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    FontAwesomeModule,
    CardModule,
    TableModule,
    TabViewModule,
    DataViewModule,
    TagModule,
    SplitButtonModule,
    AvatarModule,
    MatMenuModule,
    CalendarModule,
    InputNumberModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
