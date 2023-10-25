import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LlamadoComponent } from './components/llamado/llamado.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'llamado', component: LlamadoComponent },
  { path: 'ejecutivo', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
