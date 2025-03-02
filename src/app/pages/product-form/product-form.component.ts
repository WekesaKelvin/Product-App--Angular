import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';

// Import Angular Material Snackbar
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
    private snackBar: MatSnackBar  // <-- Inject MatSnackBar
  ) {
    this.productForm = this.fb.group({
      id: [0],
      name: [''],
      price: [0]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.productId = +idParam; // Convert to number
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
    const formValue: Product = this.productForm.value;

    if (this.productId) {
      // We have an ID => update the product
      this.productService.updateProduct(formValue);
      this.openSnackBar('Product successfully updated!');
    } else {
      // No ID => add a new product
      this.productService.addProduct(formValue);
      this.openSnackBar('Product successfully added!');
    }

    // Reset the form
    this.productForm.reset({ id: 0, name: '', price: 0 });
  }

  // Reusable method to show a snackbar message
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,   // 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
