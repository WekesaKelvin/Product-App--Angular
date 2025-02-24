import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [
    { id: 1, name: 'Laptop', price: 50000 },
    { id: 2, name: 'Phone', price: 30000 },
  ];

  product = { id: 0, name: '', price: 0 };
  editMode = false;

  // Create or Update Product
  onSubmit() {
    if (this.editMode) {
      // Update existing product
      this.products = this.products.map(p =>
        p.id === this.product.id ? { ...this.product } : p
      );
      this.editMode = false;
    } else {
      // Add new product
      this.product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
      this.products.push({ ...this.product });
    }
    this.resetForm();
  }

  // Edit Product
  editProduct(product: any) {
    this.product = { ...product };
    this.editMode = true;
  }

  // Delete Product
  deleteProduct(productId: number) {
    this.products = this.products.filter(p => p.id !== productId);
  }

  // Reset Form
  resetForm() {
    this.product = { id: 0, name: '', price: 0 };
  }
}