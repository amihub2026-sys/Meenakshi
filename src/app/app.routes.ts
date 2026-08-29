import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { SpecialsComponent } from './pages/specials/specials.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Madurai Meenakshi Santhana Kadai' },
  { path: 'about', component: AboutComponent, title: 'About | Madurai Meenakshi Santhana Kadai' },
  { path: 'products', component: ProductsComponent, title: 'Products | Madurai Meenakshi Santhana Kadai' },
  { path: 'specials', component: SpecialsComponent, title: 'Specials | Madurai Meenakshi Santhana Kadai' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Madurai Meenakshi Santhana Kadai' },
  { path: '**', redirectTo: '' }
];
