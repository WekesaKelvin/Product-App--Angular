import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { Routes } from '@angular/router';

export const routes: Routes = [


  { path: 'list', component: ProductListComponent },
  { path: 'form', component: ProductFormComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];




