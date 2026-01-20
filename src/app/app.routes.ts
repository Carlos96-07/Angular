import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ClienteComponent } from '../app/app/components/cliente/cliente.component';
import { ClienteFormComponent } from '../app/app/components/cliente/cliente-form.component';
import { ProductoComponent } from '../app/app/components/producto/producto.component'; 
import { ProductoFormComponent } from '../app/app/components/producto/producto-form.component'; 

// Importar componentes de facturación
import { FacturasComponent } from '../app/app/components/facturas/factura.component';
import { NuevaFacturaComponent } from '../app/app/components/facturas/nueva-factura.component';
import { DetalleFacturaComponent } from '../app/app/components/facturas/detalle-factura.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  
 // RUTAS PROTEGIDAS
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      
      // Rutas de Clientes
      { path: 'cliente', component: ClienteComponent },
      { path: 'clientes/nuevo', component: ClienteFormComponent },
      { path: 'clientes/editar/:id', component: ClienteFormComponent },
      
      // Rutas de Productos
      { path: 'producto', component: ProductoComponent },
      { path: 'producto/nuevo', component: ProductoFormComponent },
      { path: 'producto/editar/:id', component: ProductoFormComponent },
      
      // Rutas de Facturas
      { path: 'facturas', component: FacturasComponent },
      { path: 'facturas/nueva', component: NuevaFacturaComponent },
      { path: 'facturas/:id', component: DetalleFacturaComponent },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Ruta por defecto - redirige a login
  {
    path: '**',
    redirectTo: 'login'
  }
];