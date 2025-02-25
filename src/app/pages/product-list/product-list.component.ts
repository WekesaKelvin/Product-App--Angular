import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  product: Product = { id: 0, name: '', price: 0 };
  editMode = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Fetch product list from ProductService
  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  // Create or Update Product
  onSubmit(): void {
    if (this.editMode) {
      this.productService.updateProduct(this.product);
      this.editMode = false;
    } else {
      this.productService.addProduct({ ...this.product });
    }
    this.resetForm();
    this.loadProducts(); // Refresh the list
  }

  // Edit Product
  editProduct(product: Product): void {
    this.product = { ...product };
    this.editMode = true;
  }

  // Delete Product
  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId);
    this.loadProducts(); // Refresh the list
  }

  // Reset Form
  resetForm(): void {
    this.product = { id: 0, name: '', price: 0 };
  }
}
