import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      id: [0],
      name: [''],
      price: [0]
    });
  }

  ngOnInit(): void {
    // Check if there's an 'id' parameter in the route
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.productId = +idParam; // Convert to number
        // We are in "edit" mode. Fetch the product from the service
        const existingProduct = this.productService
          .getProducts()
          .find(p => p.id === this.productId);

        if (existingProduct) {
          // Patch the form with existing product data
          this.productForm.patchValue({
            id: existingProduct.id,
            name: existingProduct.name,
            price: existingProduct.price
          });
        }
      } else {
        // No ID => "add" mode
        this.productId = null;
      }
    });
  }

  onSubmit() {
    const formValue: Product = this.productForm.value;

    if (this.productId) {
      // We have an ID => update the product
      this.productService.updateProduct(formValue);
    } else {
      // No ID => add a new product
      this.productService.addProduct(formValue);
    }

    // Reset the form
    this.productForm.reset({ id: 0, name: '', price: 0 });
  }
}
