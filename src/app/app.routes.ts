import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';  // Asegúrate de importar el AdminDashboardComponent
import { InvoicesComponent } from './components/invoices/invoices.component';  // Asegúrate de tener estos componentes
import { ClientsComponent } from './components/clients/clients.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminGuard } from './guards/admin.guard';  // Importar el AdminGuard
import { NgModule } from '@angular/core';
import { noAuthGuard } from './guards/no-auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],  // Aplicamos el guard para que no puedan acceder los usuarios autenticados

  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent,
    canActivate: [noAuthGuard],  

  },
  {
    path:'reset-password',
    component:ResetPasswordComponent,
    canActivate: [noAuthGuard],  

  }
  ,
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],  // Protección mediante AdminGuard
    children: [
      {
        path: 'invoices',
        component: InvoicesComponent,
        canActivate: [AdminGuard],  // Protege la ruta de Invoices
      },
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AdminGuard],  // Protege la ruta de Clients
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AdminGuard],  // Protege la ruta de Products
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''  // Redirige cualquier ruta desconocida a la ruta raíz
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
