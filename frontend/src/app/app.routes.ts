import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { SegmentosComponent } from './segmentos/segmentos.component';
import { GerenciasComponent } from './gerencia/gerencia.component';
import { GenerarCredencialComponent } from './generar-credencial/generar-credencial.component';
import { DescargarCredencialComponent } from './descargar-credencial/descargar-credencial.component';   
import { GenerarFirmaComponent } from './generar-firma/generar-firma.component';
import { FirmaExitosaComponent } from './firma-exitosa/firma-exitosa.component';
import { CredencialExitosaComponent } from './credencial-exitosa/credencial-exitosa.component';
import { CredencialWebComponent } from './credencialWeb/credencialWeb';
import { AuthGuard } from './auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['Jefatura'] } },
    { path: 'colaboradores', component: ColaboradoresComponent, canActivate: [AuthGuard], data: { roles: ['Jefatura'] } },
    { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } }, 
    { path: 'segmentos', component: SegmentosComponent, canActivate: [AuthGuard], data: { roles: ['Jefatura'] } },
    { path: 'gerencias', component: GerenciasComponent, canActivate: [AuthGuard], data: { roles: ['Jefatura'] } },
    { path: 'generar', component: GenerarCredencialComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } },
    { path: 'descargar', component: DescargarCredencialComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } },
    { path: 'generarfirma', component: GenerarFirmaComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } },
    { path: 'firmaexitosa/:id', component: FirmaExitosaComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } },
    { path: 'credencialexitosa/:id', component: CredencialExitosaComponent, canActivate: [AuthGuard], data: { roles: ['Colaborador', 'Jefatura'] } },
    { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent },
    { path: 'credencialweb', component: CredencialWebComponent },
    { path: '**', component: NotFoundComponent },
  ];
  
