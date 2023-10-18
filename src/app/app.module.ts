import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { FloatingButtonComponent } from './components/floating-button/floating-button.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidebarModule } from 'primeng/sidebar';
import { SpeedDialModule } from 'primeng/speeddial';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FloatingButtonComponent,
    SocialMediaComponent
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
    ConfirmPopupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
