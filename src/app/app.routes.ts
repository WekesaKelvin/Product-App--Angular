import { Routes } from '@angular/router';
import { HomeComponent } from './views/src/home/home.component';
import { ProductListComponent } from './views/src/home/product-list/product-list.component';
import { ProductFormComponent } from './views/src/home/product-form/product-form.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ProductListComponent },
  { path: 'form', component: ProductFormComponent },
  { path: 'form/:id', component: ProductFormComponent },
  { path: '**', redirectTo: '' }
];
