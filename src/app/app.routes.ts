import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Set HomeComponent as the default
  { path: 'list', component: ProductListComponent },
  { path: 'form', component: ProductFormComponent },
  { path: '**', redirectTo: '' }
];

