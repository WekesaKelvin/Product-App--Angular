import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, map } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product: any;
  dispatch(arg0: { productId: number; } & Action<"[Product] Delete Product">) {
    throw new Error('Method not implemented.');
  }
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Smartphone', price: 599 },
  ];

  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.products);

  constructor(private router: Router) {}

  getProducts$(): Observable<Product[]> {
    return this.productsSubject.asObservable().pipe(
      delay(500),
      map(()=> this.products),
      catchError(error => {
        console.error('Error fetching products', error);
        return throwError(error);
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    if (Math.random() < 0.3) {
      return throwError('Simulated API failure: Unable to add product').pipe(delay(500));
    }
    const maxId = this.products.reduce((acc, cur) => (cur.id > acc ? cur.id : acc), 0);
    const newProduct: Product = { ...product, id: maxId + 1 };
    this.products.push(newProduct);
    this.productsSubject.next(this.products);
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(updated: Product): Observable<Product> {
    const index = this.products.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      this.products[index] = updated;
      this.productsSubject.next(this.products);
      return of(updated).pipe(delay(500));
    }
    return throwError('Product not found').pipe(delay(500));
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.productsSubject.next(this.products);
      return of(true).pipe(delay(500));
    }
    return throwError('Product not found').pipe(delay(500));
  }
}


  