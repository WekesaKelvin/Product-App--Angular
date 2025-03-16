import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductFeatureService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 120000 },
    { id: 2, name: 'Smartphone', price: 50000 },
    { id: 3, name: 'Headphones', price: 8000 }
  ];

  constructor() {}

  // Method to return products
  getProducts(): Product[] {
    return [...this.products]; // Return a copy to avoid mutation issues
  }

  // Method to delete a product
  deleteProduct(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }
}
