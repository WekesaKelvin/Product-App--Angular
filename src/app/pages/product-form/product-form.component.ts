import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    // Initializing the reactive form
    this.productForm = this.fb.group({
      id: [0],
      name: [''],
      price: [0]
    });
  }

  onSubmit() {
    const newProduct: Product = this.productForm.value;
    // Adds the new product
    this.productService.addProduct(newProduct);

    // Resets the form to blank
    this.productForm.reset({ id: 0, name: '', price: 0 });
  }
}
