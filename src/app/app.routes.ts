import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { SpecialsComponent } from './pages/specials/specials.component';
import { ContactComponent } from './pages/contact/contact.component';

import { AdminLayoutComponent } from './pages/admin/layout/layout';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard';
import { AdminProductsComponent } from './pages/admin/products/products';
import { AdminUserDetailsComponent } from './pages/admin/user-details/user-details';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home | Madurai Meenakshi Santhana Kadai'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About | Madurai Meenakshi Santhana Kadai'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products | Madurai Meenakshi Santhana Kadai'
  },
  {
    path: 'specials',
    component: SpecialsComponent,
    title: 'Specials | Madurai Meenakshi Santhana Kadai'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact | Madurai Meenakshi Santhana Kadai'
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        title: 'Dashboard | Admin'
      },
      {
        path: 'products',
        component: AdminProductsComponent,
        title: 'Product Management | Admin'
      },
      {
        path: 'user-details',
        component: AdminUserDetailsComponent,
        title: 'User Details | Admin'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];