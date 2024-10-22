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

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent},
    {path: 'colaboradores', component: ColaboradoresComponent},
    {path: 'segmentos', component: SegmentosComponent},
    {path: 'gerencias', component: GerenciasComponent},
    {path: 'generar', component:GenerarCredencialComponent},
    {path:'descargar', component:DescargarCredencialComponent},
    {path: 'generarfirma', component: GenerarFirmaComponent},
    { path: 'firmaexitosa/:id', component: FirmaExitosaComponent },
    {path:'credencialexitosa/:id', component:CredencialExitosaComponent},
    {path:'credencialweb', component:CredencialWebComponent},

];
