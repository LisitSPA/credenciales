import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { AreasComponent } from './areas/areas.component';
import { JefaturasComponent } from './jefaturas/jefaturas.component';
import { GenerarCredencialComponent } from './generar-credencial/generar-credencial.component';
import { DescargarCredencialComponent } from './descargar-credencial/descargar-credencial.component';   
import { GenerarFirmaComponent } from './generar-firma/generar-firma.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent},
    {path: 'colaboradores', component: ColaboradoresComponent},
    {path: 'areas', component: AreasComponent},
    {path: 'jefaturas', component: JefaturasComponent},
    {path: 'generar', component:GenerarCredencialComponent},
    {path:'descargar', component:DescargarCredencialComponent},
    {path: 'generarfirma', component: GenerarFirmaComponent},

];
