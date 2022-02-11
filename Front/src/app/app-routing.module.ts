import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';

import { EventosComponent } from './components/eventos/eventos.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';

import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';


import { PaginaNaoEncontradaComponent } from './components/paginanaoencontrada/paginanaoencontrada.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '',  redirectTo: '/usuario/login', pathMatch: 'full'},
  { path: 'usuario', redirectTo: 'usuario/perfil', pathMatch: 'full' },
  {
    path: 'usuario', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent, },
      { path: 'cadastro', component: RegistrationComponent, },
    ]
  },  
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'usuario/perfil', component: PerfilComponent },
      { path: 'eventos', redirectTo: 'eventos/lista', pathMatch: 'full' },
      {
        path: 'eventos', component: EventosComponent,
        children: [
          { path: 'detalhe/:id', component: EventoDetalheComponent, },
          { path: 'cadastro', component: EventoDetalheComponent, },
          { path: 'lista', component: EventoListaComponent, },
        ], canActivate: [AuthGuard]
      },
      { path: 'palestrantes', component: PalestrantesComponent },
      { path: 'dashboard', component: DashboardComponent },  
    ]
  },
  { path: 'paginanaoencontrada', component: PaginaNaoEncontradaComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
