import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar  
  ) {
   this.productForm = this.fb.group({
  id: [0, [Validators.required, Validators.min(1)]],
  name: ['', [Validators.required, Validators.minLength(3)]],
  price: [0, [Validators.required, Validators.min(1)]]
});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.productId = +idParam; 
        const existingProduct = this.productService
          .getProducts()
          .find(p => p.id === this.productId);

        if (existingProduct) {
          this.productForm.patchValue({
            id: existingProduct.id,
            name: existingProduct.name,
            price: existingProduct.price
          });
        }
      } else {
        this.productId = null;
      }
    });
  }

onSubmit() {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched(); 
    this.openSnackBar('Please fill out all fields correctly.');
    return;
  }

  const formValue: Product = this.productForm.value;

  if (this.productId) {
    this.productService.updateProduct(formValue);
    this.openSnackBar('Product successfully updated!');
  } else {
    this.productService.addProduct(formValue);
    this.openSnackBar('Product successfully added!');
  }

  this.productForm.reset({ id: 0, name: '', price: 0 });
}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,   
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
