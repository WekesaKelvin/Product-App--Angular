import { Injectable } from '@angular/core';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Smartphone', price: 599 },
  ];

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Product): void {
    const maxId = this.products.reduce((acc, cur) => (cur.id > acc ? cur.id : acc), 0);
    const newId = maxId + 1;
    const newProduct: Product = { ...product, id: newId };
    this.products.push(newProduct);
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
  
  updateProduct(updated: Product): void {
    const index = this.products.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      this.products[index] = updated;
    }
  }
}
