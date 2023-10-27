import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LlamadoComponent } from './components/llamado/llamado.component';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'llamado', component: LlamadoComponent },
  { path: 'ejecutivo', component: EjecutivoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
