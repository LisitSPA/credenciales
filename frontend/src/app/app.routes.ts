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

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'colaboradores', component: ColaboradoresComponent, canActivate: [AuthGuard] },
    { path: 'segmentos', component: SegmentosComponent, canActivate: [AuthGuard] },
    { path: 'gerencias', component: GerenciasComponent, canActivate: [AuthGuard] },
    { path: 'generar', component: GenerarCredencialComponent, canActivate: [AuthGuard] },
    { path: 'descargar', component: DescargarCredencialComponent, canActivate: [AuthGuard] },
    { path: 'generarfirma', component: GenerarFirmaComponent, canActivate: [AuthGuard] },
    { path: 'firmaexitosa/:id', component: FirmaExitosaComponent, canActivate: [AuthGuard] },
    { path: 'credencialexitosa/:id', component: CredencialExitosaComponent, canActivate: [AuthGuard] },
    { path: 'credencialweb', component: CredencialWebComponent },
    { path: '**', component: NotFoundComponent }
];
