import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as ProductActions from '../store/product.actions';
import { Product } from '../../product.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { selectError, selectProductState } from '../store/product.selectors';
import { take } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterModule, MatIconModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;

  storeService = inject(ProductService);
  dialog = inject(MatDialog);
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      id: [0],
      name: ['',[Validators.required, Validators.minLength(2)]],
      price: [0,[Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Retrieves product id from route parameters and patch the form if editing
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.productId = +idParam;
        this.storeService.getProducts$().subscribe(products => {
          const product = products.find(p => p.id === this.productId);
          if (product) {
            this.productForm.patchValue(product);
          } else {
            console.error('Product not found');
          }
        });
      }
    });


    // Subscribes to the product state for success/failure handling
    this.store.pipe(select(selectProductState), take(1)).subscribe(state => {
      console.log("Products: ",state.products)
      if (state.error) {
        this.openSnackBar(`Operation failed: ${state.error}`);
      } else if (this.productId && state.products.some(p => p.id === this.productId)) {
        this.openSnackBar('Product successfully updated!');
        this.router.navigate(['/list']);
      } else if (!this.productId && state.products.length > 0) {
        this.openSnackBar('Product successfully added!');
        this.router.navigate(['/list']);
      }
    });

    // Subscribes to error selector to catch any errors
    this.store.select(selectError).subscribe(error => {
      if (error) {
        this.openSnackBar(`Operation failed: ${error}`);
      }
    });
  }
  onSubmit(): void {
    // Check if form is invalid
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Show validation errors
      return; // Prevent submission
    }
  
    const formValue = this.productForm.value;
  
    if (this.productId) {
      
      this.storeService.updateProduct(formValue).subscribe(() => {
        this.openSnackBar('Product updated successfully!');
        this.productForm.reset({ id: 0, name: '', price: 0 }); 
        this.router.navigate(['/list']); 
      });
    } else {
      
      this.storeService.addProduct(formValue).subscribe(() => {
        this.openSnackBar('Product added successfully!');
        this.productForm.reset({ id: 0, name: '', price: 0 }); 
        this.router.navigate(['/list']); 
      });
    }
  }
  

  openSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}


